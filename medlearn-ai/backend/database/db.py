import aiosqlite
import json
from datetime import datetime
import os

DB_PATH = "data/medlearn.db"

async def init_db():
    """Initialize the database with required tables"""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                query TEXT NOT NULL,
                slides_content TEXT NOT NULL,
                quiz_questions TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()
        print(f" Database initialized at {DB_PATH}")

async def save_session(session_id: str, query: str, slides_content: list, quiz_questions: list):
    """Save a learning session to the database"""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """
            INSERT INTO sessions (id, query, slides_content, quiz_questions)
            VALUES (?, ?, ?, ?)
            """,
            (
                session_id,
                query,
                json.dumps(slides_content),
                json.dumps(quiz_questions)
            )
        )
        await db.commit()

async def get_session(session_id: str):
    """Retrieve a session from the database"""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM sessions WHERE id = ?",
            (session_id,)
        ) as cursor:
            row = await cursor.fetchone()
            if row:
                return {
                    'id': row['id'],
                    'query': row['query'],
                    'slides_content': json.loads(row['slides_content']),
                    'quiz_questions': json.loads(row['quiz_questions']),
                    'created_at': row['created_at']
                }
            return None
