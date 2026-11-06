
from database import get_db_connection

connection = get_db_connection()

try:
    employer = connection.execute("""
        SELECT
            users.id,
            users.full_name,
            users.mobile,
            users.email,
            users.role,
            users.location,
            employer_profiles.business_name,
            employer_profiles.business_type,
            employer_profiles.business_address,
            users.password_hash
        FROM users
        INNER JOIN employer_profiles
        ON users.id = employer_profiles.user_id
        WHERE users.role = 'employer'
        ORDER BY users.id DESC
        LIMIT 1
    """).fetchone()

    if employer:
        print("Employer account found!")
        print("User ID:", employer["id"])
        print("Contact Person:", employer["full_name"])
        print("Business Name:", employer["business_name"])
        print("Business Type:", employer["business_type"])
        print("Mobile:", employer["mobile"])
        print("Email:", employer["email"])
        print("Location:", employer["location"])
        print("Business Address:", employer["business_address"])
        print(
            "Password stored as hash:",
            bool(employer["password_hash"])
        )
    else:
        print("No employer account found.")

finally:
    connection.close()
