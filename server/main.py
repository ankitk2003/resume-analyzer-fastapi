
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from server.db.database import get_db, Base, engine
from server.routes import user_routes,resume_routes,recruiter_routes
from server.models.resume_model import Resume
from server.models.user_model import User, Email
from server.models.recruiter_model import Recruiter,RecruiterResume,JobDescription

from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="FastAPI Auth Project",
    description="JWT Protected Routes with Swagger UI",
    version="1.0.0"
)

# Include routes
app.include_router(user_routes.router)
app.include_router(resume_routes.router)
app.include_router(recruiter_routes.router)
app.mount("/files", StaticFiles(directory="uploads"), name="files")

# CORS middleware (optional: customize origins for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-create tables
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    print(f"🚀 Connected to DB: {engine.url}")

@app.get("/")
def read_root():
    return {"message": "FastAPI is running"}

# ✅ Swagger UI: Enable Bearer Token Auth
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

