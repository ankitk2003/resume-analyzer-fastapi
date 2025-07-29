from qdrant_client import QdrantClient
from qdrant_client.http import models
import os

client = QdrantClient(
    url=os.getenv("QDRANT_URL", "http://localhost:6333"),
    api_key=os.getenv("QDRANT_API_KEY")  # Can be None for local
)

def ensure_recruiter_index():
    """Ensure index exists for recruiter_id to allow filtered delete."""
    try:
        client.create_payload_index(
            collection_name="resume_embeddings",
            field_name="recruiter_id",
            field_schema=models.PayloadSchemaType.INTEGER
        )
    except Exception as e:
        print("Index creation skipped or already exists:", str(e))


def delete_old_resumes_for_recruiter(recruiter_id: int):
    ensure_recruiter_index()  # Call before using filter
    client.delete(
        collection_name="resume_embeddings",
        points_selector=models.Filter(
            must=[
                models.FieldCondition(
                    key="recruiter_id",
                    match=models.MatchValue(value=recruiter_id)
                )
            ]
        )
    )
