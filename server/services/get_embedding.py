from sentence_transformers import SentenceTransformer

# Load once globally to avoid repeated loading
model = SentenceTransformer("all-MiniLM-L6-v2")  # Small, fast, 384-dim vectors

def get_embedding(text: str) -> list:
    """
    Returns the sentence embedding for the given text using SentenceTransformer.
    """
    if not text:
        return []

    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()  # Return as plain list for JSON compatibility
