import os
from dotenv import load_dotenv
from pathlib import Path

# Find .env file by searching from this file's location upward
load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("KEY:", GEMINI_API_KEY)

