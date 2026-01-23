from flask import Flask, render_template, send_file, abort, Response
from typing import Final, Union, Tuple, Dict, Set
from pathlib import Path
import os

app: Flask = Flask(__name__)

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

if __name__ == '__main__':
    port: int = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)