from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
import uuid
import os

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

def create_resume_collection():
    client.recreate_collection(
        collection_name="resume_embeddings",
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )

collection_name = "resume_embeddings"

def store_resume_embedding(embedding: list[float], recruiter_id: int, resume_text: str):
    resume_id = str(uuid.uuid4())
    
    client.upsert(
        collection_name=collection_name,
        points=[
            PointStruct(
                id=resume_id,
                vector=embedding,
                payload={
                    "recruiter_id": recruiter_id,
                    "resume_id": resume_id,  # optional but helpful
                    "resume_text": resume_text
                }
            )
        ]
    )
    return {"status": "success", "resume_id": resume_id}
