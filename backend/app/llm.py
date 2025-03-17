from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os

load_dotenv()

class LLM:

    @staticmethod
    def get_llm(temperature=0.5, timeout=10, max_retries=4):
        llm = ChatGoogleGenerativeAI(
            model=os.getenv("MODEL_NAME"), # "gemini-pro"
            temperature=temperature,
            timeout=timeout,
            max_retries=max_retries,
            google_api_key=os.getenv("GOOGLE_API_KEY"),
        )
        return llm
