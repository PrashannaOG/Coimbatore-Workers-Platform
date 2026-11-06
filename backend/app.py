
import re
import sqlite3

import os
from datetime import timedelta

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from database import get_db_connection, initialize_database


app = Flask(__name__)

# Secret key used to sign session cookies.
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "Prashanna@25"

if not app.secret_key:
    raise RuntimeError("FLASK_SECRET_KEY environment variable is not set.")

# Allow the React frontend to communicate with Flask using cookies.
CORS(
    app,
    origins=["http://localhost:5173"],
    supports_credentials=True
)

# Session cookie security settings.
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False  # Local development only

# Remember-me sessions can last up to 30 days.
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=30)

# Create database tables when the application starts.
initialize_database()


# Allowed values from the Worker Registration form.
ALLOWED_LOCATIONS = {
    "Coimbatore",
    "Tiruppur",
    "Erode",
    "Pollachi",
    "Mettupalayam"
}

ALLOWED_CATEGORIES = {
    "Construction",
    "Electrician",
    "Plumbing",
    "Driving",
    "Delivery",
    "Factory Work",
    "Housekeeping",
    "Security",
    "Other"
}

ALLOWED_EXPERIENCE = {
    "Fresher",
    "Less than 1 year",
    "1–3 years",
    "3–5 years",
    "Above 5 years"
}


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to Coimbatore Workers Platform Backend!",
        "status": "Running successfully"
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Backend API is working correctly"
    })


@app.route("/api/database-check", methods=["GET"])
def database_check():
    connection = get_db_connection()

    try:
        result = connection.execute(
            "SELECT name FROM sqlite_master "
            "WHERE type='table' AND name='users'"
        ).fetchone()

        if result:
            return jsonify({
                "status": "success",
                "message": "SQLite database connected successfully!",
                "table": "users"
            }), 200

        return jsonify({
            "status": "error",
            "message": "Users table not found"
        }), 500

    finally:
        connection.close()


# Worker Registration API
@app.route("/api/register/worker", methods=["POST"])
def register_worker():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Please provide valid JSON data."
        }), 400

    # Read and clean the submitted information.
    full_name = str(data.get("fullName") or "").strip()
    mobile = str(data.get("mobile") or "").strip()
    email = str(data.get("email") or "").strip().lower()
    location = str(data.get("location") or "").strip()
    category = str(data.get("category") or "").strip()
    experience = str(data.get("experience") or "").strip()
    print("Received experience:", repr(experience))
    print("Allowed experience values:", [repr(value) for value in ALLOWED_EXPERIENCE])
    password = data.get("password")

    # Validate required fields.
    if not all([
        full_name,
        mobile,
        location,
        category,
        experience
    ]):
        return jsonify({
            "status": "error",
            "message": "Please fill in all required fields."
        }), 400

    # Validate password.
    if not isinstance(password, str) or len(password) < 8:
        return jsonify({
            "status": "error",
            "message": "Password must contain at least 8 characters."
        }), 400

    # Confirm that the user accepted the terms.
    if data.get("acceptedTerms") is not True:
        return jsonify({
            "status": "error",
            "message": "Please accept the Terms and Conditions."
        }), 400

    # Validate Indian mobile number.
    if not re.fullmatch(r"[6-9]\d{9}", mobile):
        return jsonify({
            "status": "error",
            "message": "Please enter a valid 10-digit Indian mobile number."
        }), 400

    # Validate optional email.
    if email and not re.fullmatch(
        r"[^@\s]+@[^@\s]+\.[^@\s]+",
        email
    ):
        return jsonify({
            "status": "error",
            "message": "Please enter a valid email address."
        }), 400

    # Validate dropdown selections.
    if location not in ALLOWED_LOCATIONS:
        return jsonify({
            "status": "error",
            "message": "Please select a valid location."
        }), 400

    if category not in ALLOWED_CATEGORIES:
        return jsonify({
            "status": "error",
            "message": "Please select a valid work category."
        }), 400

    if experience not in ALLOWED_EXPERIENCE:
        return jsonify({
            "status": "error",
            "message": "Please select a valid experience level."
        }), 400

    # Hash the password before storing it.
    password_hash = generate_password_hash(password)

    connection = get_db_connection()

    try:
        # Check for an existing mobile number.
        existing_mobile = connection.execute(
            "SELECT id FROM users WHERE mobile = ?",
            (mobile,)
        ).fetchone()

        if existing_mobile:
            return jsonify({
                "status": "error",
                "message": "This mobile number is already registered."
            }), 409

        # Check for an existing email, if provided.
        if email:
            existing_email = connection.execute(
                "SELECT id FROM users WHERE email = ?",
                (email,)
            ).fetchone()

            if existing_email:
                return jsonify({
                    "status": "error",
                    "message": "This email address is already registered."
                }), 409

        # Insert common account information.
        cursor = connection.execute(
            """
            INSERT INTO users (
                full_name,
                email,
                mobile,
                password_hash,
                role,
                location
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                full_name,
                email if email else None,
                mobile,
                password_hash,
                "worker",
                location
            )
        )

        user_id = cursor.lastrowid

        # Insert worker-specific profile information.
        connection.execute(
            """
            INSERT INTO worker_profiles (
                user_id,
                work_category,
                experience
            )
            VALUES (?, ?, ?)
            """,
            (user_id, category, experience)
        )

        connection.commit()

        return jsonify({
            "status": "success",
            "message": "Worker account created successfully!",
            "user": {
                "id": user_id,
                "fullName": full_name,
                "role": "worker"
            }
        }), 201

    except sqlite3.IntegrityError:
        connection.rollback()

        return jsonify({
            "status": "error",
            "message": "This mobile number or email is already registered."
        }), 409

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "status": "error",
            "message": "A database error occurred. Please try again."
        }), 500

    finally:
        connection.close()

    
# Allowed business types from the Employer Registration form.
ALLOWED_BUSINESS_TYPES = {
    "Individual / Contractor",
    "Shop / Retail",
    "Manufacturing / Factory",
    "Construction Company",
    "Service Business",
    "Logistics / Delivery",
    "Other"
}


# Employer Registration API
@app.route("/api/register/employer", methods=["POST"])
def register_employer():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Please provide valid JSON data."
        }), 400

    # Read and clean the submitted information.
    contact_name = str(data.get("contactName") or "").strip()
    business_name = str(data.get("businessName") or "").strip()
    business_type = str(data.get("businessType") or "").strip()
    mobile = str(data.get("mobile") or "").strip()
    email = str(data.get("email") or "").strip().lower()
    location = str(data.get("location") or "").strip()
    address = str(data.get("address") or "").strip()
    password = data.get("password")

    # Validate required fields.
    if not all([
        contact_name,
        business_name,
        business_type,
        mobile,
        email,
        location,
        address
    ]):
        return jsonify({
            "status": "error",
            "message": "Please fill in all required fields."
        }), 400

    # Validate password.
    if not isinstance(password, str) or len(password) < 8:
        return jsonify({
            "status": "error",
            "message": "Password must contain at least 8 characters."
        }), 400

    # Confirm that the user accepted the terms.
    if data.get("acceptedTerms") is not True:
        return jsonify({
            "status": "error",
            "message": "Please accept the Terms and Conditions."
        }), 400

    # Validate Indian mobile number.
    if not re.fullmatch(r"[6-9]\d{9}", mobile):
        return jsonify({
            "status": "error",
            "message": "Please enter a valid 10-digit Indian mobile number."
        }), 400

    # Validate email.
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({
            "status": "error",
            "message": "Please enter a valid email address."
        }), 400

    # Validate location.
    if location not in ALLOWED_LOCATIONS:
        return jsonify({
            "status": "error",
            "message": "Please select a valid location."
        }), 400

    # Validate business type.
    if business_type not in ALLOWED_BUSINESS_TYPES:
        return jsonify({
            "status": "error",
            "message": "Please select a valid business type."
        }), 400

    # Hash the password before storing it.
    password_hash = generate_password_hash(password)

    connection = get_db_connection()

    try:
        # Check for an existing mobile number.
        existing_mobile = connection.execute(
            "SELECT id FROM users WHERE mobile = ?",
            (mobile,)
        ).fetchone()

        if existing_mobile:
            return jsonify({
                "status": "error",
                "message": "This mobile number is already registered."
            }), 409

        # Check for an existing email address.
        existing_email = connection.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,)
        ).fetchone()

        if existing_email:
            return jsonify({
                "status": "error",
                "message": "This email address is already registered."
            }), 409

        # Insert common account information.
        cursor = connection.execute(
            """
            INSERT INTO users (
                full_name,
                email,
                mobile,
                password_hash,
                role,
                location
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                contact_name,
                email,
                mobile,
                password_hash,
                "employer",
                location
            )
        )

        user_id = cursor.lastrowid

        # Insert employer-specific business information.
        connection.execute(
            """
            INSERT INTO employer_profiles (
                user_id,
                business_name,
                business_type,
                business_address
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                user_id,
                business_name,
                business_type,
                address
            )
        )

        connection.commit()

        return jsonify({
            "status": "success",
            "message": "Employer account created successfully!",
            "user": {
                "id": user_id,
                "fullName": contact_name,
                "businessName": business_name,
                "role": "employer"
            }
        }), 201

    except sqlite3.IntegrityError:
        connection.rollback()

        return jsonify({
            "status": "error",
            "message": "This mobile number or email is already registered."
        }), 409

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "status": "error",
            "message": "A database error occurred. Please try again."
        }), 500

    finally:
        connection.close()


    
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)

    # Check whether valid JSON data was received.
    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Invalid request data."
        }), 400

    identifier = data.get("identifier")
    password = data.get("password")
    remember_me = data.get("rememberMe", False)

    # Validate input types and required fields.
    if not isinstance(identifier, str) or not isinstance(password, str):
        return jsonify({
            "success": False,
            "message": "Email/mobile number and password are required."
        }), 400

    identifier = identifier.strip()

    if not identifier or not password:
        return jsonify({
            "success": False,
            "message": "Email/mobile number and password are required."
        }), 400

    if not isinstance(remember_me, bool):
        return jsonify({
            "success": False,
            "message": "Invalid Remember Me value."
        }), 400

    # Determine whether the identifier is an email or mobile number.
    is_email = re.fullmatch(
        r"[^\s@]+@[^\s@]+\.[^\s@]+",
        identifier
    )

    is_mobile = re.fullmatch(
        r"[6-9]\d{9}",
        identifier
    )

    if not is_email and not is_mobile:
        return jsonify({
            "success": False,
            "message": "Enter a valid email address or mobile number."
        }), 400

    connection = get_db_connection()

    try:
        # Find the account using its email or mobile number.
        if is_email:
            user = connection.execute("""
                SELECT id, full_name, email, mobile,
                       password_hash, role, location
                FROM users
                WHERE email = ? COLLATE NOCASE
            """, (identifier,)).fetchone()

        else:
            user = connection.execute("""
                SELECT id, full_name, email, mobile,
                       password_hash, role, location
                FROM users
                WHERE mobile = ?
            """, (identifier,)).fetchone()

        # Verify the submitted password against the stored hash.
        if not user or not check_password_hash(
            user["password_hash"],
            password
        ):
            return jsonify({
                "success": False,
                "message": "Invalid email/mobile number or password."
            }), 401

        # Create a fresh session after successful authentication.
        session.clear()

        session["user_id"] = user["id"]
        session["role"] = user["role"]
        session["full_name"] = user["full_name"]

        # Remember Me controls whether the session persists
        # after the browser is closed.
        session.permanent = remember_me

        return jsonify({
            "success": True,
            "message": "Login successful!",
            "user": {
                "id": user["id"],
                "fullName": user["full_name"],
                "role": user["role"],
                "location": user["location"]
            }
        }), 200

    except sqlite3.Error:
        return jsonify({
            "success": False,
            "message": "A database error occurred."
        }), 500

    finally:
        connection.close()




@app.route("/api/me", methods=["GET"])
def get_current_user():

    # Check whether a user ID exists in the session.
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "success": False,
            "message": "You are not logged in."
        }), 401

    connection = get_db_connection()

    try:
        user = connection.execute("""
            SELECT
                users.id,
                users.full_name,
                users.email,
                users.mobile,
                users.role,
                users.location,
                worker_profiles.work_category,
                worker_profiles.experience

            FROM users

            LEFT JOIN worker_profiles
                ON users.id = worker_profiles.user_id

            WHERE users.id = ?
        """, (user_id,)).fetchone()

        if not user:
            session.clear()

            return jsonify({
                "success": False,
                "message": "User account not found."
            }), 401

        return jsonify({
            "success": True,
            "user": {
                "id": user["id"],
                "fullName": user["full_name"],
                "email": user["email"],
                "mobile": user["mobile"],
                "role": user["role"],
                "location": user["location"],
                "workCategory": user["work_category"],
                "experience": user["experience"]
            }
        }), 200

    except sqlite3.Error:
        return jsonify({
            "success": False,
            "message": "A database error occurred."
        }), 500

    finally:
        connection.close()


# Worker Profile Update API
@app.route("/api/worker/profile", methods=["PUT"])
def update_worker_profile():

    # Verify that the worker is logged in.
    user_id = session.get("user_id")

    if not user_id or session.get("role") != "worker":
        return jsonify({
            "success": False,
            "message": "Worker authentication required."
        }), 401

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Please provide valid JSON data."
        }), 400

    # Read and clean the submitted information.
    full_name = str(data.get("fullName") or "").strip()
    location = str(data.get("location") or "").strip()
    work_category = str(data.get("workCategory") or "").strip()
    experience = str(data.get("experience") or "").strip()

    # Validate required fields.
    if not all([
        full_name,
        location,
        work_category,
        experience
    ]):
        return jsonify({
            "success": False,
            "message": "All profile fields are required."
        }), 400

    # Validate field lengths.
    if len(full_name) > 100:
        return jsonify({
            "success": False,
            "message": "Name cannot exceed 100 characters."
        }), 400

    # Validate allowed dropdown values.
    if location not in ALLOWED_LOCATIONS:
        return jsonify({
            "success": False,
            "message": "Please select a valid location."
        }), 400

    if work_category not in ALLOWED_CATEGORIES:
        return jsonify({
            "success": False,
            "message": "Please select a valid work category."
        }), 400

    if experience not in ALLOWED_EXPERIENCE:
        return jsonify({
            "success": False,
            "message": "Please select a valid experience level."
        }), 400

    connection = get_db_connection()

    
    try:
        # Update the common user information.
        cursor = connection.execute("""
            UPDATE users
            SET full_name = ?,
                location = ?
            WHERE id = ?
              AND role = 'worker'
        """, (full_name, location, user_id))

        if cursor.rowcount == 0:
            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Worker account not found."
            }), 404

        # Update worker-specific information.
        profile_cursor = connection.execute("""
            UPDATE worker_profiles
            SET work_category = ?,
                experience = ?
            WHERE user_id = ?
        """, (work_category, experience, user_id))

        if profile_cursor.rowcount == 0:
            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Worker profile record not found."
            }), 404

        connection.commit()

        # Update the name stored in the session.
        session["full_name"] = full_name

        return jsonify({
            "success": True,
            "message": "Profile updated successfully!"
        }), 200


    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "A database error occurred. Please try again."
        }), 500

    finally:
        connection.close()

# Worker Change Password API
@app.route("/api/worker/change-password", methods=["POST"])
def change_worker_password():

    # Verify worker authentication.
    user_id = session.get("user_id")

    if not user_id or session.get("role") != "worker":
        return jsonify({
            "success": False,
            "message": "Worker authentication required."
        }), 401

    # Read submitted password information.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Please provide valid JSON data."
        }), 400

    current_password = data.get("currentPassword")
    new_password = data.get("newPassword")
    confirm_password = data.get("confirmPassword")

    # Validate password fields.
    if not all(
        isinstance(value, str) and value
        for value in (
            current_password,
            new_password,
            confirm_password
        )
    ):
        return jsonify({
            "success": False,
            "message": "Please fill in all password fields."
        }), 400

    if len(new_password) < 8:
        return jsonify({
            "success": False,
            "message": "New password must contain at least 8 characters."
        }), 400

    if new_password != confirm_password:
        return jsonify({
            "success": False,
            "message": "New password and confirmation do not match."
        }), 400

    connection = get_db_connection()

    try:
        # Retrieve the logged-in worker's password hash.
        user = connection.execute("""
            SELECT password_hash
            FROM users
            WHERE id = ?
              AND role = 'worker'
        """, (user_id,)).fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Worker account not found."
            }), 404

        # Verify the current password.
        if not check_password_hash(
            user["password_hash"],
            current_password
        ):
            return jsonify({
                "success": False,
                "message": "Current password is incorrect."
            }), 400

        # Prevent reusing the current password.
        if check_password_hash(
            user["password_hash"],
            new_password
        ):
            return jsonify({
                "success": False,
                "message": "New password must be different from your current password."
            }), 400

        # Hash and save the new password.
        new_password_hash = generate_password_hash(new_password)

        connection.execute("""
            UPDATE users
            SET password_hash = ?
            WHERE id = ?
              AND role = 'worker'
        """, (new_password_hash, user_id))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Password changed successfully."
        }), 200

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to change password. Please try again."
        }), 500

    finally:
        connection.close()
    
# Employer Job Posting API
@app.route("/api/employer/jobs", methods=["POST"])
def create_job():

    # 1. Verify employer authentication.
    user_id = session.get("user_id")

    if not user_id or session.get("role") != "employer":
        return jsonify({
            "success": False,
            "message": "Employer authentication required."
        }), 401

    # 2. Read submitted JSON data.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Please provide valid JSON data."
        }), 400

    # 3. Extract and clean job information.
    job_title = str(data.get("jobTitle") or "").strip()
    work_category = str(data.get("workCategory") or "").strip()
    job_description = str(data.get("jobDescription") or "").strip()
    location = str(data.get("location") or "").strip()
    job_address = str(data.get("jobAddress") or "").strip()
    job_type = str(data.get("jobType") or "").strip()
    experience_required = str(data.get("experienceRequired") or "").strip()

    # 4. Validate required fields.
    required_fields = [
        job_title,
        work_category,
        job_description,
        location,
        job_address,
        job_type,
        experience_required
    ]

    if not all(required_fields):
        return jsonify({
            "success": False,
            "message": "Please complete all required fields."
        }), 400

    # 5. Validate text lengths.
    if len(job_title) > 100:
        return jsonify({
            "success": False,
            "message": "Job title cannot exceed 100 characters."
        }), 400

    if len(job_description) > 3000:
        return jsonify({
            "success": False,
            "message": "Job description cannot exceed 3000 characters."
        }), 400

    if len(job_address) > 250:
        return jsonify({
            "success": False,
            "message": "Job address cannot exceed 250 characters."
        }), 400

    # 6. Validate allowed job types.
    allowed_job_types = {
        "Full-time",
        "Part-time",
        "Contract",
        "Temporary"
    }

    if job_type not in allowed_job_types:
        return jsonify({
            "success": False,
            "message": "Please select a valid job type."
        }), 400

    # 7. Validate salary and vacancy information.
    try:
        salary_min = int(data.get("salaryMin"))
        salary_max = int(data.get("salaryMax"))
        vacancies = int(data.get("vacancies"))

    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Please enter valid salary and vacancy numbers."
        }), 400

    if salary_min < 0 or salary_max < salary_min:
        return jsonify({
            "success": False,
            "message": "Please enter a valid salary range."
        }), 400

    if vacancies < 1 or vacancies > 1000:
        return jsonify({
            "success": False,
            "message": "Vacancies must be between 1 and 1000."
        }), 400

    # 8. Save the job in SQLite.
    connection = get_db_connection()

    try:
        cursor = connection.execute("""
            INSERT INTO jobs (
                employer_id,
                job_title,
                work_category,
                job_description,
                location,
                job_address,
                job_type,
                salary_min,
                salary_max,
                vacancies,
                experience_required
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            job_title,
            work_category,
            job_description,
            location,
            job_address,
            job_type,
            salary_min,
            salary_max,
            vacancies,
            experience_required
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Job posted successfully!",
            "jobId": cursor.lastrowid
        }), 201

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to publish job. Please try again."
        }), 500

    finally:
        connection.close()

# Employer My Jobs API
@app.route("/api/employer/jobs", methods=["GET"])
def get_employer_jobs():

    # Check whether the user is logged in
    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please log in first."
        }), 401

    # Check whether the logged-in user is an employer
    if session.get("role") != "employer":
        return jsonify({
            "success": False,
            "message": "Only employers can access their jobs."
        }), 403

    employer_id = session["user_id"]

    connection = get_db_connection()

    try:
        rows = connection.execute("""
            SELECT
                id,
                job_title,
                work_category,
                job_description,
                location,
                job_address,
                job_type,
                salary_min,
                salary_max,
                vacancies,
                experience_required,
                status,
                created_at
            FROM jobs
            WHERE employer_id = ?
            ORDER BY created_at DESC
        """, (employer_id,)).fetchall()

        jobs = [dict(row) for row in rows]

        return jsonify({
            "success": True,
            "jobs": jobs
        }), 200

    except sqlite3.Error:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve jobs."
        }), 500

    finally:
        connection.close()


# Public Job Listings API
@app.route("/api/jobs", methods=["GET"])
def get_available_jobs():

    connection = get_db_connection()

    try:
        rows = connection.execute("""
            SELECT
                id,
                job_title,
                work_category,
                job_description,
                location,
                job_type,
                salary_min,
                salary_max,
                vacancies,
                experience_required,
                created_at
            FROM jobs
            WHERE status = 'Active'
            ORDER BY created_at DESC
        """).fetchall()

        jobs = [dict(row) for row in rows]

        return jsonify({
            "success": True,
            "jobs": jobs
        }), 200

    except sqlite3.Error:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve available jobs."
        }), 500

    finally:
        connection.close()

# Save Job API (Worker)
@app.route("/api/worker/saved-jobs/<int:job_id>", methods=["POST"])
def save_job(job_id):

    if "user_id" not in session or session.get("role") != "worker":
        return jsonify({
            "success": False,
            "message": "Worker login required."
        }), 401

    connection = get_db_connection()

    try:
        # Check whether the job exists and is active.
        job = connection.execute("""
            SELECT id
            FROM jobs
            WHERE id = ? AND status = 'Active'
        """, (job_id,)).fetchone()

        if not job:
            return jsonify({
                "success": False,
                "message": "Job not found or no longer available."
            }), 404

        worker_id = session["user_id"]

        # Check whether the worker has already saved this job.
        existing = connection.execute("""
            SELECT id
            FROM saved_jobs
            WHERE worker_id = ? AND job_id = ?
        """, (worker_id, job_id)).fetchone()

        if existing:
            return jsonify({
                "success": True,
                "message": "This job is already saved."
            }), 200

        connection.execute("""
            INSERT INTO saved_jobs (worker_id, job_id)
            VALUES (?, ?)
        """, (worker_id, job_id))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Job saved successfully."
        }), 201

    except sqlite3.Error as error:
        print("Save Job Error:", error)

        return jsonify({
            "success": False,
            "message": "Unable to save this job."
        }), 500

    finally:
        connection.close()

# Retrieve Saved Jobs API (Worker)
@app.route("/api/worker/saved-jobs", methods=["GET"])
def get_saved_jobs():

    if "user_id" not in session or session.get("role") != "worker":
        return jsonify({
            "success": False,
            "message": "Worker login required."
        }), 401

    connection = get_db_connection()

    try:
        worker_id = session["user_id"]

        rows = connection.execute("""
            SELECT
                saved_jobs.id AS saved_id,
                jobs.id AS job_id,
                jobs.job_title,
                jobs.work_category,
                jobs.job_description,
                jobs.location,
                jobs.job_address,
                jobs.job_type,
                jobs.salary_min,
                jobs.salary_max,
                jobs.vacancies,
                jobs.experience_required,
                jobs.status,
                jobs.created_at,
                saved_jobs.saved_at,
                users.full_name AS employer_name
            FROM saved_jobs
            INNER JOIN jobs
                ON saved_jobs.job_id = jobs.id
            INNER JOIN users
                ON jobs.employer_id = users.id
            WHERE saved_jobs.worker_id = ?
            ORDER BY saved_jobs.saved_at DESC
        """, (worker_id,)).fetchall()

        saved_jobs = [dict(row) for row in rows]

        return jsonify({
            "success": True,
            "saved_jobs": saved_jobs
        }), 200

    except sqlite3.Error as error:
        print("Retrieve Saved Jobs Error:", error)

        return jsonify({
            "success": False,
            "message": "Unable to retrieve saved jobs."
        }), 500

    finally:
        connection.close()

# Remove Saved Job API (Worker)
@app.route("/api/worker/saved-jobs/<int:job_id>", methods=["DELETE"])
def remove_saved_job(job_id):

    if "user_id" not in session or session.get("role") != "worker":
        return jsonify({
            "success": False,
            "message": "Worker login required."
        }), 401

    connection = get_db_connection()

    try:
        worker_id = session["user_id"]

        cursor = connection.execute("""
            DELETE FROM saved_jobs
            WHERE worker_id = ? AND job_id = ?
        """, (worker_id, job_id))

        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "success": False,
                "message": "Saved job not found."
            }), 404

        return jsonify({
            "success": True,
            "message": "Job removed from saved jobs."
        }), 200

    except sqlite3.Error as error:
        print("Remove Saved Job Error:", error)

        return jsonify({
            "success": False,
            "message": "Unable to remove saved job."
        }), 500

    finally:
        connection.close()

# Employer View Applications API
@app.route("/api/employer/applications", methods=["GET"])
def get_employer_applications():

    # 1. Verify employer authentication.
    employer_id = session.get("user_id")

    if not employer_id or session.get("role") != "employer":
        return jsonify({
            "success": False,
            "message": "Employer authentication required."
        }), 401

    connection = get_db_connection()

    try:
        # 2. Retrieve applications belonging only to this employer.
        rows = connection.execute("""
            SELECT
                a.id AS application_id,
                a.job_id,
                a.worker_id,
                a.cover_letter,
                a.status,
                a.created_at,

                j.job_title,

                u.full_name AS worker_name,
                u.email AS worker_email,
                u.mobile AS worker_mobile,
                u.location AS worker_location,

                wp.work_category,
                wp.experience

            FROM applications a

            INNER JOIN jobs j
                ON a.job_id = j.id

            INNER JOIN users u
                ON a.worker_id = u.id

            LEFT JOIN worker_profiles wp
                ON a.worker_id = wp.user_id

            WHERE j.employer_id = ?

            ORDER BY a.created_at DESC
        """, (employer_id,)).fetchall()

        applications = [dict(row) for row in rows]

        return jsonify({
            "success": True,
            "applications": applications
        }), 200

    except sqlite3.Error:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve applications."
        }), 500

    finally:
        connection.close()

# Employer Update Application Status API
@app.route(
    "/api/employer/applications/<int:application_id>/status",
    methods=["PATCH"]
)
def update_application_status(application_id):

    # 1. Verify employer authentication.
    employer_id = session.get("user_id")

    if not employer_id or session.get("role") != "employer":
        return jsonify({
            "success": False,
            "message": "Employer authentication required."
        }), 401

    # 2. Read the requested status.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Please provide valid application data."
        }), 400

    new_status = data.get("status")

    allowed_statuses = [
        "Shortlisted",
        "Accepted",
        "Rejected"
    ]

    if new_status not in allowed_statuses:
        return jsonify({
            "success": False,
            "message": "Invalid application status."
        }), 400

    connection = get_db_connection()

    try:
        # 3. Verify that the application belongs to this employer.
        application = connection.execute("""
            SELECT a.id
            FROM applications a
            INNER JOIN jobs j
                ON a.job_id = j.id
            WHERE a.id = ?
              AND j.employer_id = ?
        """, (application_id, employer_id)).fetchone()

        if not application:
            return jsonify({
                "success": False,
                "message": "Application not found."
            }), 404

        # 4. Update application status.
        connection.execute("""
            UPDATE applications
            SET status = ?
            WHERE id = ?
        """, (new_status, application_id))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Application status updated successfully.",
            "status": new_status
        }), 200

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to update application status."
        }), 500

    finally:
        connection.close()



@app.route("/api/worker/applications", methods=["GET"])
def get_worker_applications():
    worker_id = session.get("user_id")

    if not worker_id or session.get("role") != "worker":
        return jsonify({
            "success": False,
            "message": "Worker authentication required."
        }), 401

    connection = get_db_connection()

    try:
        rows = connection.execute("""
            SELECT
                a.id AS application_id,
                a.job_id,
                a.status,
                a.cover_letter,
                a.created_at AS applied_at,
                j.job_title,
                j.work_category,
                j.location AS job_location,
                j.job_type,
                j.salary_min,
                j.salary_max,
                u.full_name AS employer_name,
                ep.business_name
            FROM applications a
            INNER JOIN jobs j ON a.job_id = j.id
            INNER JOIN users u ON j.employer_id = u.id
            LEFT JOIN employer_profiles ep ON j.employer_id = ep.user_id
            WHERE a.worker_id = ?
            ORDER BY a.created_at DESC
        """, (worker_id,)).fetchall()

        applications = [dict(row) for row in rows]

        # Count all currently active jobs on the platform.
        active_jobs = connection.execute("""
            SELECT COUNT(*) AS total
            FROM jobs
            WHERE status = 'Active'
        """).fetchone()["total"]

        # Calculate this worker's application statistics.
        total_applications = len(applications)

        shortlisted = sum(
            1 for application in applications
            if application["status"] == "Shortlisted"
        )

        accepted = sum(
            1 for application in applications
            if application["status"] == "Accepted"
        )

        return jsonify({
            "success": True,
            "applications": applications,
            "stats": {
                "availableJobs": active_jobs,
                "applicationsSent": total_applications,
                "shortlisted": shortlisted,
                "accepted": accepted
            }
        }), 200

    except sqlite3.Error:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve your applications."
        }), 500

    finally:
        connection.close()



# Worker Apply for Job API
@app.route("/api/jobs/<int:job_id>/apply", methods=["POST"])
def apply_for_job(job_id):

    # 1. Verify worker authentication.
    user_id = session.get("user_id")

    if not user_id or session.get("role") != "worker":
        return jsonify({
            "success": False,
            "message": "Worker authentication required."
        }), 401

    # 2. Read submitted application information.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Please provide valid application data."
        }), 400

    cover_letter = data.get("coverLetter", "")

    if not isinstance(cover_letter, str):
        return jsonify({
            "success": False,
            "message": "Cover letter must be valid text."
        }), 400

    cover_letter = cover_letter.strip()

    if len(cover_letter) > 1000:
        return jsonify({
            "success": False,
            "message": "Cover letter cannot exceed 1000 characters."
        }), 400

    connection = get_db_connection()

    try:
        # 3. Check whether the job exists and is active.
        job = connection.execute("""
            SELECT id
            FROM jobs
            WHERE id = ?
              AND status = 'Active'
        """, (job_id,)).fetchone()

        if not job:
            return jsonify({
                "success": False,
                "message": "This job is unavailable or has been closed."
            }), 404

        # 4. Check whether the worker has already applied.
        existing_application = connection.execute("""
            SELECT id
            FROM applications
            WHERE job_id = ?
              AND worker_id = ?
        """, (job_id, user_id)).fetchone()

        if existing_application:
            return jsonify({
                "success": False,
                "message": "You have already applied for this job."
            }), 409

        # 5. Save the application.
        cursor = connection.execute("""
            INSERT INTO applications (
                job_id,
                worker_id,
                cover_letter
            )
            VALUES (?, ?, ?)
        """, (
            job_id,
            user_id,
            cover_letter if cover_letter else None
        ))

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Your job application was submitted successfully!",
            "applicationId": cursor.lastrowid
        }), 201

    except sqlite3.IntegrityError:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "You have already applied for this job."
        }), 409

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to submit your application. Please try again."
        }), 500

    finally:
        connection.close()


# Employer Edit Job API
@app.route("/api/employer/jobs/<int:job_id>", methods=["PUT"])
def update_employer_job(job_id):

    # 1. Verify employer authentication.
    user_id = session.get("user_id")

    if not user_id or session.get("role") != "employer":
        return jsonify({
            "success": False,
            "message": "Employer authentication required."
        }), 401

    # 2. Read submitted JSON data.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Please provide valid JSON data."
        }), 400

    # 3. Extract and clean job information.
    job_title = str(data.get("jobTitle") or "").strip()
    work_category = str(data.get("workCategory") or "").strip()
    job_description = str(data.get("jobDescription") or "").strip()
    location = str(data.get("location") or "").strip()
    job_address = str(data.get("jobAddress") or "").strip()
    job_type = str(data.get("jobType") or "").strip()
    experience_required = str(data.get("experienceRequired") or "").strip()

    # 4. Validate required fields.
    if not all([
        job_title,
        work_category,
        job_description,
        location,
        job_address,
        job_type,
        experience_required
    ]):
        return jsonify({
            "success": False,
            "message": "Please complete all required fields."
        }), 400

    # 5. Validate text lengths.
    if len(job_title) > 100:
        return jsonify({
            "success": False,
            "message": "Job title cannot exceed 100 characters."
        }), 400

    if len(job_description) > 3000:
        return jsonify({
            "success": False,
            "message": "Job description cannot exceed 3000 characters."
        }), 400

    if len(job_address) > 250:
        return jsonify({
            "success": False,
            "message": "Job address cannot exceed 250 characters."
        }), 400

    # 6. Validate employment type.
    allowed_job_types = {
        "Full-time",
        "Part-time",
        "Contract",
        "Temporary"
    }

    if job_type not in allowed_job_types:
        return jsonify({
            "success": False,
            "message": "Please select a valid job type."
        }), 400

    # 7. Validate salary and vacancies.
    try:
        salary_min = int(data.get("salaryMin"))
        salary_max = int(data.get("salaryMax"))
        vacancies = int(data.get("vacancies"))

    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Please enter valid salary and vacancy numbers."
        }), 400

    if salary_min < 0 or salary_max < salary_min:
        return jsonify({
            "success": False,
            "message": "Please enter a valid salary range."
        }), 400

    if vacancies < 1 or vacancies > 1000:
        return jsonify({
            "success": False,
            "message": "Vacancies must be between 1 and 1000."
        }), 400

    connection = get_db_connection()

    try:
        # 8. Update only a job owned by this employer.
        cursor = connection.execute("""
            UPDATE jobs
            SET job_title = ?,
                work_category = ?,
                job_description = ?,
                location = ?,
                job_address = ?,
                job_type = ?,
                salary_min = ?,
                salary_max = ?,
                vacancies = ?,
                experience_required = ?
            WHERE id = ?
              AND employer_id = ?
        """, (
            job_title,
            work_category,
            job_description,
            location,
            job_address,
            job_type,
            salary_min,
            salary_max,
            vacancies,
            experience_required,
            job_id,
            user_id
        ))

        if cursor.rowcount == 0:
            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Job not found or you do not have permission to edit it."
            }), 404

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Job updated successfully!"
        }), 200

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to update job. Please try again."
        }), 500

    finally:
        connection.close()

# Employer Close / Reopen Job API
@app.route("/api/employer/jobs/<int:job_id>/status", methods=["PATCH"])
def update_job_status(job_id):

    # 1. Verify employer authentication.
    user_id = session.get("user_id")

    if not user_id or session.get("role") != "employer":
        return jsonify({
            "success": False,
            "message": "Employer authentication required."
        }), 401

    # 2. Read submitted JSON data.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Please provide valid JSON data."
        }), 400

    # 3. Read the requested status.
    new_status = data.get("status")

    # 4. Validate the requested status.
    allowed_statuses = {"Active", "Closed"}

    if new_status not in allowed_statuses:
        return jsonify({
            "success": False,
            "message": "Status must be Active or Closed."
        }), 400

    connection = get_db_connection()

    try:
        # 5. Update only a job owned by this employer.
        cursor = connection.execute("""
            UPDATE jobs
            SET status = ?
            WHERE id = ?
              AND employer_id = ?
        """, (
            new_status,
            job_id,
            user_id
        ))

        # 6. Check whether the job exists.
        if cursor.rowcount == 0:
            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Job not found or you do not have permission to update it."
            }), 404

        connection.commit()

        return jsonify({
            "success": True,
            "message": f"Job status changed to {new_status} successfully!",
            "status": new_status
        }), 200

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to update job status. Please try again."
        }), 500

    finally:
        connection.close()
    
# Employer Delete Job API
@app.route("/api/employer/jobs/<int:job_id>", methods=["DELETE"])
def delete_employer_job(job_id):

    # 1. Verify employer authentication.
    user_id = session.get("user_id")

    if not user_id or session.get("role") != "employer":
        return jsonify({
            "success": False,
            "message": "Employer authentication required."
        }), 401

    connection = get_db_connection()

    try:
        # 2. Delete only a job owned by this employer.
        cursor = connection.execute("""
            DELETE FROM jobs
            WHERE id = ?
              AND employer_id = ?
        """, (
            job_id,
            user_id
        ))

        # 3. Check whether the job exists.
        if cursor.rowcount == 0:
            connection.rollback()

            return jsonify({
                "success": False,
                "message": "Job not found or you do not have permission to delete it."
            }), 404

        connection.commit()

        return jsonify({
            "success": True,
            "message": "Job deleted successfully!"
        }), 200

    except sqlite3.Error:
        connection.rollback()

        return jsonify({
            "success": False,
            "message": "Unable to delete job. Please try again."
        }), 500

    finally:
        connection.close()

@app.route("/api/logout", methods=["POST"])
def logout():

    # Remove all login information from the session.
    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out successfully!"
    }), 200



if __name__ == "__main__":
    app.run(debug=True, port=5000)

