
from database import get_db_connection

connection = get_db_connection()

try:
    worker = connection.execute("""
        SELECT
            users.id,
            users.full_name,
            users.mobile,
            users.email,
            users.role,
            users.location,
            worker_profiles.work_category,
            worker_profiles.experience,
            users.password_hash
        FROM users
        INNER JOIN worker_profiles
        ON users.id = worker_profiles.user_id
        WHERE users.role = 'worker'
        ORDER BY users.id DESC
        LIMIT 1
    """).fetchone()

    if worker:
        print("Worker account found!")
        print("User ID:", worker["id"])
        print("Name:", worker["full_name"])
        print("Mobile:", worker["mobile"])
        print("Email:", worker["email"])
        print("Role:", worker["role"])
        print("Location:", worker["location"])
        print("Category:", worker["work_category"])
        print("Experience:", worker["experience"])
        print(
            "Password stored as hash:",
            bool(worker["password_hash"])
        )
    else:
        print("No worker account found.")

finally:
    connection.close()
