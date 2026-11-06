
import sqlite3
from pathlib import Path

# Keep the database file in the backend folder,
# regardless of where the application is started.
DATABASE_PATH = Path(__file__).resolve().parent / "coimbatore_workers.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row

    # Enable foreign key relationships in SQLite.
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


def initialize_database():
    connection = get_db_connection()

    try:
        # Common account information for workers and employers.
        connection.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE,
                mobile TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL
                    CHECK(role IN ('worker', 'employer')),
                location TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Additional information specific to workers.
        connection.execute("""
            CREATE TABLE IF NOT EXISTS worker_profiles (
                user_id INTEGER PRIMARY KEY,
                work_category TEXT NOT NULL,
                experience TEXT NOT NULL,

                FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
        """)

        # Additional information specific to employers.
        connection.execute("""
            CREATE TABLE IF NOT EXISTS employer_profiles (
                user_id INTEGER PRIMARY KEY,
                business_name TEXT NOT NULL,
                business_type TEXT NOT NULL,
                business_address TEXT NOT NULL,

                FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
        """)

        
        # Create jobs table
        connection.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                employer_id INTEGER NOT NULL,

                job_title TEXT NOT NULL,
                work_category TEXT NOT NULL,
                job_description TEXT NOT NULL,

                location TEXT NOT NULL,
                job_address TEXT NOT NULL,

                job_type TEXT NOT NULL
                    CHECK(job_type IN (
                        'Full-time',
                        'Part-time',
                        'Contract',
                        'Temporary'
                    )),

                salary_min INTEGER,
                salary_max INTEGER,

                vacancies INTEGER NOT NULL DEFAULT 1,

                experience_required TEXT NOT NULL,

                status TEXT NOT NULL DEFAULT 'Active'
                    CHECK(status IN ('Active', 'Closed')),

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (employer_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
        """)


                # Store jobs saved by workers.
        connection.execute("""
            CREATE TABLE IF NOT EXISTS saved_jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                worker_id INTEGER NOT NULL,
                job_id INTEGER NOT NULL,

                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                UNIQUE(worker_id, job_id),

                FOREIGN KEY (worker_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (job_id)
                    REFERENCES jobs(id)
                    ON DELETE CASCADE
            )
        """)


        connection.commit()

    finally:
        connection.close()


if __name__ == "__main__":
    initialize_database()

    connection = get_db_connection()

    tables = connection.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).fetchall()

    print("Database tables:")

    for table in tables:
        print(table["name"])

    connection.close()
