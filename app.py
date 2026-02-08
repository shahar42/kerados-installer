from flask import Flask, render_template, send_file, abort, Response, request, jsonify
from typing import Final, Union, Tuple, Dict, Set, Optional
from pathlib import Path
import os
import re
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

app: Flask = Flask(__name__)

# Database connection
DATABASE_URL: Optional[str] = os.environ.get('DATABASE_URL')
db_engine = None

if DATABASE_URL:
    try:
        db_engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    except Exception as e:
        print(f"Database connection failed: {e}")

# Configuration
INSTALLER_FILENAME: Final[str] = "shlookapaka_installer.exe"
# Ensure we refer to the absolute path relative to the app root
DOWNLOADS_DIR: Final[Path] = Path(app.root_path) / 'static' / 'downloads'

@app.route('/')
def index() -> str:
    """Landing page with download button"""
    return render_template('index.html')

@app.route('/download')
def download_installer() -> Union[Response, Tuple[Dict[str, str], int]]:
    """Serve the shlookapaka installer"""
    file_path: Path = DOWNLOADS_DIR / INSTALLER_FILENAME

    if not file_path.exists():
        abort(404, description="Installer file not found")

    return send_file(
        file_path,
        as_attachment=True,
        download_name=INSTALLER_FILENAME,
        mimetype='application/octet-stream'
    )

@app.route('/legal/<page_name>')
def legal(page_name: str) -> str:
    """Serve legal pages"""
    VALID_PAGES: Final[Set[str]] = {'terms', 'privacy', 'accessibility', 'impressum'}
    
    if page_name in VALID_PAGES:
        return render_template(f'legal/{page_name}.html')
    abort(404)

@app.route('/health')
def health() -> Tuple[Dict[str, str], int]:
    """Health check endpoint for Render"""
    return {"status": "healthy"}, 200

@app.route('/api/waitlist', methods=['POST'])
def add_to_waitlist() -> Tuple[Dict[str, str], int]:
    """Add user to waitlist"""
    if not db_engine:
        return {"error": "Database not configured"}, 503

    try:
        data: Dict = request.get_json()

        # Validate required fields
        required_fields: Final[Set[str]] = {'first_name', 'last_name', 'email', 'reason'}
        if not all(field in data for field in required_fields):
            return {"error": "Missing required fields"}, 400

        # Extract and sanitize data
        first_name: str = data['first_name'].strip()
        last_name: str = data['last_name'].strip()
        email: str = data['email'].strip().lower()
        reason: str = data['reason'].strip()

        # Validate field lengths
        if not (1 <= len(first_name) <= 100):
            return {"error": "First name must be 1-100 characters"}, 400
        if not (1 <= len(last_name) <= 100):
            return {"error": "Last name must be 1-100 characters"}, 400
        if not (1 <= len(reason) <= 5000):
            return {"error": "Reason must be 1-5000 characters"}, 400

        # Validate email format
        email_regex: Final[str] = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return {"error": "Invalid email format"}, 400

        # Insert into database
        with db_engine.connect() as conn:
            query = text("""
                INSERT INTO waitlist (first_name, last_name, email, reason)
                VALUES (:first_name, :last_name, :email, :reason)
            """)

            conn.execute(query, {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'reason': reason
            })
            conn.commit()

        return {"message": "Successfully added to waitlist"}, 201

    except IntegrityError:
        # Email already exists (unique constraint)
        return {"error": "This email is already on the waitlist"}, 409
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return {"error": "Database error occurred"}, 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": "An unexpected error occurred"}, 500

if __name__ == '__main__':
    port: int = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)