from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct,VectorParams,Distance
import uuid

client = QdrantClient(host="localhost", port=6333)
def create_resume_collection():
    client.recreate_collection(
        collection_name="resume_embeddings",
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )

collection_name = "resume_embeddings"

def store_resume_embedding(embedding: list, recruiter_id: int, resume_text: str):
    resume_id = str(uuid.uuid4())
    client.upload_points(
        collection_name=collection_name,
        points=[
            PointStruct(
                id=resume_id,
                vector=embedding,
                payload={
                    "recruiter_id": recruiter_id,
                    "resume_text": resume_text
                }
            )
        ]
    )
    return {"resume_id": resume_id}
