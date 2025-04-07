import os
from typing import List, Optional
from PyPDF2 import PdfReader
from langchain_experimental.text_splitter import SemanticChunker
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import chromadb
from chromadb import PersistentClient
import logging
import numpy as np

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
GOOGLE_API_KEY = "AIzaSyCjhtUjPxDAfJSZiVXVWrf6U8Vnjfmgiwg"
DB_PATH = "chroma_rag_data"
DB_NAME = "pet_chunks"
pdfpath = "data/data.pdf"

# Create a ChromaDB-compatible embedding function wrapper
class ChromaEmbeddingFunction:
    def __init__(self, api_key: str):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key
        )
    
    def __call__(self, input: List[str]) -> List[List[float]]:
        """Convert input texts to embeddings."""
        if not input:
            return []
        
        # Generate embeddings for each text
        embeddings = []
        for text in input:
            try:
                embedding = self.embeddings.embed_query(text)
                embeddings.append(embedding)
            except Exception as e:
                logger.error(f"Error generating embedding: {str(e)}")
                # Return a zero vector as fallback
                embeddings.append()  
        
        return embeddings

def read_pdf(pdf_path: str) -> str:
    """Extract text from PDF file."""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logger.error(f"Error reading PDF: {str(e)}")
        raise

def read_text_file(text_path: str) -> str:
    """Read content from text file."""
    try:
        with open(text_path, "r", encoding="utf-8") as file:
            return file.read()
    except Exception as e:
        logger.error(f"Error reading text file: {str(e)}")
        raise

def process_content(content: str) -> List:
    """Process content using semantic chunking."""
    try:
        # Initialize embeddings
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=GOOGLE_API_KEY
        )
        
        # Create semantic chunks
        text_splitter = SemanticChunker(
            embeddings,
            breakpoint_threshold_type="percentile",
            breakpoint_threshold_amount=70,
            min_chunk_size=512
        )
        
        docs = text_splitter.create_documents([content])
        logger.info(f"Created {len(docs)} chunks")
        
        # Print sample chunks for verification
        for i, doc in enumerate(docs[:3]):
            logger.info(f"Sample chunk {i+1}: {doc.page_content[:200]}...")
        
        return docs
    except Exception as e:
        logger.error(f"Error processing content: {str(e)}")
        raise

def create_or_load_vectordb(documents: List, path: str, name: str) -> chromadb.Collection:
    """Create or load ChromaDB and store embeddings."""
    try:
        # Initialize ChromaDB client
        chroma_client = PersistentClient(path=path)
        
        # Create ChromaDB-compatible embedding function
        embedding_function = ChromaEmbeddingFunction(GOOGLE_API_KEY)
        
        # Check for existing collection
        existing_collections = [col for col in chroma_client.list_collections()]
        
        if name in existing_collections:
            logger.info(f"Loading existing collection: {name}")
            collection = chroma_client.get_collection(
                name=name,
                embedding_function=embedding_function
            )
        else:
            logger.info(f"Creating new collection: {name}")
            collection = chroma_client.create_collection(
                name=name,
                embedding_function=embedding_function
            )
        
        # Add documents to collection
        for i in range(0, len(documents), 100):  # Process in batches of 100
            batch = documents[i:i + 100]
            texts = [doc.page_content if hasattr(doc, 'page_content') else str(doc) for doc in batch]
            ids = [str(j) for j in range(i, min(i + 100, len(documents)))]
            metadatas = [{"chunk_index": j} for j in range(i, min(i + 100, len(documents)))]
            
            try:
                collection.add(
                    documents=texts,
                    ids=ids,
                    metadatas=metadatas
                )
                logger.info(f"Added batch of {len(texts)} documents")
            except chromadb.errors.DuplicateIDError:
                logger.warning(f"Skipping duplicate documents in batch starting at {i}")
        
        return collection
    except Exception as e:
        logger.error(f"Error creating/loading vector database: {str(e)}")
        raise

def main():
    try:
        # File paths
        pdf_file_path = pdfpath  # Add your PDF file path here
        #text_file_path = ""  # Add your text file path here
        
        # Extract content based on file type
        if pdf_file_path and os.path.exists(pdf_file_path):
            content = read_pdf(pdf_file_path)
            logger.info("Successfully read PDF file")
        # elif text_file_path and os.path.exists(text_file_path):
        #     content = read_text_file(text_file_path)
        #     logger.info("Successfully read text file")
        else:
            raise ValueError("No valid file path provided")
        
        # Process content into chunks
        docs = process_content(content)
        
        # Create or load vector database and store embeddings
        db = create_or_load_vectordb(docs, DB_PATH, DB_NAME)
        
        logger.info("Data processing and storage completed successfully!")
        return db
    
    except Exception as e:
        logger.error(f"An error occurred during processing: {str(e)}")
        raise

if __name__ == "__main__":
    main()