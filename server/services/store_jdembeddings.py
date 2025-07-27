from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
import uuid

client = QdrantClient(host="localhost", port=6333)

# Only run this once (at startup or through CLI script)
def create_jd_collection():
    client.recreate_collection(
        collection_name="jd_embeddings",
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )

# Call once if needed
# create_jd_collection()

# ✅ Function to store JD embedding
def store_jd_embedding(embedding: list[float], recruiter_id: int, jd_text: str):
    jd_id = str(uuid.uuid4())  # Unique ID

    client.upsert(
        collection_name="jd_embeddings",
        points=[
            PointStruct(
                id=jd_id,
                vector=embedding,
                payload={
                    "recruiter_id": recruiter_id,
                    "jd_id": jd_id,
                    "jd_text": jd_text
                }
            )
        ]
    )

    return {"status": "success", "jd_id": jd_id}
