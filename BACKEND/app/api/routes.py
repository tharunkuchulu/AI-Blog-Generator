from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
from app.core.config import settings
import re

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str
    model: str

# Exact OpenRouter model names
ALLOWED_MODELS = [
    "deepseek/deepseek-chat-v3.1:free",
    "openai/gpt-oss-120b:free",
    "qwen/qwen3-coder:free",
    "moonshotai/kimi-k2:free",
    "google/gemma-3n-e2b-it:free",
    "meta-llama/llama-3.3-8b-instruct:free",
]

def count_words(text: str) -> int:
    return len(text.split())

def clean_blog_text(text: str) -> str:
    # Remove raw markdown headings like '# ' at the start of lines
    text = re.sub(r"^#+\s*", "", text, flags=re.MULTILINE)
    # Remove leading/trailing spaces
    text = text.strip()
    # Remove AI intros like "Of course," "As a world-class blogger,"
    text = re.sub(r"^(Of course|As a world-class blogger)[,]*\s*", "", text, flags=re.IGNORECASE)
    return text

@router.post("/generate")
async def generate_blog(req: GenerateRequest):
    if req.model not in ALLOWED_MODELS:
        raise HTTPException(
            status_code=400, 
            detail=f"Model '{req.model}' is not supported. Use one of: {', '.join(ALLOWED_MODELS)}"
        )

    base_prompt = f"""
You are a professional senior blogger. Write a clear, engaging, and professional blog article about: {req.prompt}.

Guidelines:
- Organize the blog dynamically based on the topic.
- Include main headings, subheadings, and side headings as appropriate.
- Use bullet points or numbered lists where relevant.
- Use paragraphs for explanations and storytelling.
- The output should be professional, readable, and polished like a senior blogger.
- Format in Markdown (#, ##, ### for headings; - or 1., 2., 3. for lists; paragraphs for content).
- Start directly with the blog content — do not include intros like "Of course" or "As a world-class blogger".
- Focus on the topic while keeping the layout flexible and professional.
"""

    payload = {
        "model": req.model,
        "messages": [
            {"role": "system", "content": "You are a professional AI blog writer."},
            {"role": "user", "content": base_prompt}
        ]
    }

    retries = 0
    blog_content = ""
    word_count = 0

    try:
        while retries < 3:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"},
                    json=payload
                )
                response.raise_for_status()
                data = response.json()

            blog_content = data["choices"][0]["message"]["content"].strip()
            blog_content = clean_blog_text(blog_content)
            word_count = count_words(blog_content)

            if 900 <= word_count <= 1100:
                break  # blog is within desired word count
            retries += 1

        if not blog_content:
            raise HTTPException(status_code=500, detail="Failed to generate blog after multiple attempts.")

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=500, detail=f"OpenRouter API returned an error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    return {"blog": blog_content, "word_count": word_count}
