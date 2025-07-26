from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
import uuid

# Initialize Qdrant client
client = QdrantClient(host="localhost", port=6333)

# Create collection (call this once on startup or keep it in the function if needed)
def create_jd_collection():
    client.recreate_collection(
        collection_name="jd_embeddings",
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )

# Call this once at startup (optional)
# create_jd_collection()

# Function to store a job description embedding
def store_jd_embedding(embedding: list[float], recruiter_id: int, jd_text: str):
    unique_jd_id = str(uuid.uuid4())  # Generate a unique ID for the JD

    client.upload_points(
        collection_name="jd_embeddings",
        points=[
            PointStruct(
                id=unique_jd_id,
                vector=embedding,
                payload={
                    "recruiter_id": recruiter_id,
                    "jd_text": jd_text
                }
            )
        ]
    )
    return {"status": "success", "jd_id": unique_jd_id}
