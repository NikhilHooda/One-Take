# PowerShell setup script for Repo Reel Creator

Write-Host "Setting up Repo Reel Creator..." -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python is required but not installed. Please install Python 3.9 or higher." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>&1
    Write-Host "Found Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is required but not installed. Please install Node.js 16 or higher." -ForegroundColor Red
    exit 1
}

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location repo-reel-creator
npm install

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

Write-Host "Setting up Python environment for storyboard creation..." -ForegroundColor Yellow
Set-Location ../storyboard-creation

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
& .\.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
python -m playwright install

Write-Host "Creating .env file for storyboard creation..." -ForegroundColor Yellow
if (!(Test-Path .env)) {
    @"
# OpenAI API Key - Required for storyboard generation
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Override model
OPENAI_MODEL=gpt-4o-mini

# Optional: Override temperature
OPENAI_TEMPERATURE=0.2

# Optional: Override timeout
OPENAI_TIMEOUT_SECONDS=120
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "Created .env file. Please add your OpenAI API key to storyboard-creation/.env" -ForegroundColor Yellow
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Add your OpenAI API key to storyboard-creation/.env" -ForegroundColor White
Write-Host "2. Start the backend: cd backend && npm start" -ForegroundColor White
Write-Host "3. Start the frontend: cd .. && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The backend will run on http://localhost:3001" -ForegroundColor Cyan
Write-Host "The frontend will run on http://localhost:5173" -ForegroundColor Cyan
