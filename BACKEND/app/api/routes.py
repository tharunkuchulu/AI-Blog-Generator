from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
from app.core.config import settings
import re
import asyncio

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str
    model: str

ALLOWED_MODELS = [
    "deepseek/deepseek-chat-v3.1:free",
    "openai/gpt-oss-120b:free",
    "qwen/qwen3-coder:free",
    "moonshotai/kimi-k2:free",
    "google/gemma-3n-e2b-it:free",
    "meta-llama/llama-3.3-8b-instruct:free",
]

def clean_blog_text(text: str) -> str:
    text = re.sub(r"^#+\s*", "", text, flags=re.MULTILINE)
    text = text.strip()
    text = re.sub(r"^(Of course|As a world-class blogger)[,]*\s*", "", text, flags=re.IGNORECASE)
    return text

def count_words(text: str) -> int:
    return len(text.split())

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
        ],
        "stream": True
    }

    async def event_generator():
        blog_content = ""
        try:
            async with httpx.AsyncClient(timeout=None) as client:
                async with client.stream(
                    "POST",
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"},
                    json=payload
                ) as response:
                    async for line in response.aiter_lines():
                        if line.strip().startswith("data: "):
                            chunk = line.removeprefix("data: ").strip()
                            if chunk == "[DONE]":
                                break
                            try:
                                delta = httpx.Response(200, content=chunk).json()
                            except Exception:
                                continue
                            if "choices" in delta and delta["choices"]:
                                delta_content = delta["choices"][0]["delta"].get("content", "")
                                if delta_content:
                                    blog_content += delta_content
                                    yield delta_content  # stream chunk to frontend

            # after streaming, clean and count words
            cleaned = clean_blog_text(blog_content)
            wc = count_words(cleaned)
            yield f"\n\n\n---\n\n[Word Count: {wc}]"

        except Exception as e:
            yield f"\n\n[Error: {str(e)}]"

    return StreamingResponse(event_generator(), media_type="text/plain")
