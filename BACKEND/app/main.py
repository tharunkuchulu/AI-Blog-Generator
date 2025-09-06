from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as blog_router

app = FastAPI(title="AI Blog Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production: replace with ["http://localhost:8080", "https://your-frontend-domain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(blog_router, prefix="/api")
