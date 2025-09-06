import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings:
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY")

settings = Settings()
