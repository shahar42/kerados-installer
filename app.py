from flask import Flask, render_template, send_file, abort, Response, request, jsonify
from typing import Final, Union, Tuple, Dict, Set, Optional
from pathlib import Path
import os
import re
import html
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import bleach

app: Flask = Flask(__name__)

# Security: Request size limit (1MB max)
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024

# Rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

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
    VALID_PAGES: Final[Set[str]] = {'terms', 'privacy', 'accessibility', 'impressum', 'ccpa-opt-out'}

    if page_name in VALID_PAGES:
        return render_template(f'legal/{page_name}.html')
    abort(404)

@app.route('/health')
def health() -> Tuple[Dict[str, str], int]:
    """Health check endpoint for Render"""
    return {"status": "healthy"}, 200

@app.route('/api/waitlist', methods=['POST'])
@limiter.limit("3 per minute")  # Strict rate limit for submissions
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

        # Extract and sanitize data (XSS protection)
        first_name: str = bleach.clean(data['first_name'].strip(), tags=[], strip=True)
        last_name: str = bleach.clean(data['last_name'].strip(), tags=[], strip=True)
        email: str = data['email'].strip().lower()
        reason: str = bleach.clean(data['reason'].strip(), tags=[], strip=True)

        # Extract consent preferences
        consent_required: bool = data.get('consent_required', False)
        consent_marketing: bool = data.get('consent_marketing', False)

        # Additional validation: no control characters
        if any(ord(c) < 32 for c in first_name + last_name + reason):
            return {"error": "Invalid characters in input"}, 400

        # Validate field lengths
        if not (1 <= len(first_name) <= 100):
            return {"error": "First name must be 1-100 characters"}, 400
        if not (1 <= len(last_name) <= 100):
            return {"error": "Last name must be 1-100 characters"}, 400
        if not (1 <= len(reason) <= 5000):
            return {"error": "Reason must be 1-5000 characters"}, 400

        # Validate email format (prevent injection)
        email_regex: Final[str] = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return {"error": "Invalid email format"}, 400

        # Check for email injection attempts
        if any(char in email for char in ['\n', '\r', '\0', '%0a', '%0d']):
            return {"error": "Invalid email format"}, 400

        # Validate consent (GDPR/CCPA requirement)
        if not consent_required:
            return {"error": "You must consent to data collection to join the waitlist"}, 400

        # Get user IP for GDPR record
        user_ip: str = request.remote_addr or request.environ.get('HTTP_X_FORWARDED_FOR', '')

        # Insert into database
        with db_engine.connect() as conn:
            query = text("""
                INSERT INTO waitlist (first_name, last_name, email, reason,
                                     consent_marketing, consent_ip)
                VALUES (:first_name, :last_name, :email, :reason,
                        :consent_marketing, :consent_ip)
            """)

            conn.execute(query, {
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'reason': reason,
                'consent_marketing': consent_marketing,
                'consent_ip': user_ip
            })
            conn.commit()

        # Return success (same message regardless of duplicate)
        return {"message": "Successfully added to waitlist"}, 201

    except IntegrityError:
        # Email already exists - return SAME response to prevent enumeration
        return {"message": "Successfully added to waitlist"}, 201
    except SQLAlchemyError as e:
        # Log without exposing details to user
        print(f"Database error: {type(e).__name__}")
        return {"error": "Unable to process request"}, 500
    except Exception as e:
        # Log without exposing details to user
        print(f"Unexpected error: {type(e).__name__}")
        return {"error": "Unable to process request"}, 500

if __name__ == '__main__':
    port: int = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)