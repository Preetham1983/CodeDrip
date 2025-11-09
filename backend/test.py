from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

try:
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client.preetham
    print("✅ Connected to MongoDB Atlas!")
    print("Databases:", client.list_database_names())
except Exception as e:
    print("❌ Connection failed:", e)
