from qdrant_client import QdrantClient 
from qdrant_client.models import Filter, FieldCondition, MatchValue, SearchRequest 
from typing import List
import numpy as np


# collection_info = client.get_collection(collection_name="resume_embeddings")
# print(collection_info)

# Assuming same embedding size and distance metric used
qdrant = QdrantClient(host="localhost", port=6333)

def match_resumes_with_jd(jd_embedding: List[float], recruiter_id: int, top_k: int = 5):
    """
    Compare JD embedding with all resume embeddings for the current recruiter.
    Return top-k most similar resumes with similarity score.
    """

    search_results = qdrant.search(
        collection_name="resume_embeddings",
        query_vector=jd_embedding,
        limit=top_k,
        with_payload=True,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="recruiter_id",
                    match=MatchValue(value=recruiter_id)
                )
            ]
        )
    )

    # Format results
    matches = [
        {
            "resume_id": point.id,
            "score": point.score,
            "filename": point.payload.get("filename"),
            "resume_text_snippet": point.payload.get("resume_text", "")[:300],  # Optional
        }
        for point in search_results
    ]

    return matches
