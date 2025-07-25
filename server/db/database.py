from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from server.core.config import settings

# Add SSL support for Postgres (Neon)
print("🚀 DB URL in use:", settings.DATABASE_URL)
connect_args = {"sslmode": "require"} if "postgresql" in settings.DATABASE_URL else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
