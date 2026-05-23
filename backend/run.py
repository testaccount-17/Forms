import uvicorn

from app.config import settings


def run() -> None:
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.is_dev,
    )


if __name__ == "__main__":
    run()
