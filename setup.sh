#!/bin/bash

echo "Setting up Repo Reel Creator..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "Installing frontend dependencies..."
cd repo-reel-creator
npm install

echo "Installing backend dependencies..."
cd backend
npm install

echo "Setting up Python environment for storyboard creation..."
cd ../storyboard-creation

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
python -m playwright install

echo "Creating .env file for storyboard creation..."
if [ ! -f .env ]; then
    cat > .env << EOF
# OpenAI API Key - Required for storyboard generation
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Override model
OPENAI_MODEL=gpt-4o-mini

# Optional: Override temperature
OPENAI_TEMPERATURE=0.2

# Optional: Override timeout
OPENAI_TIMEOUT_SECONDS=120
EOF
    echo "Created .env file. Please add your OpenAI API key to storyboard-creation/.env"
fi

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Add your OpenAI API key to storyboard-creation/.env"
echo "2. Start the backend: cd backend && npm start"
echo "3. Start the frontend: cd .. && npm run dev"
echo ""
echo "The backend will run on http://localhost:3001"
echo "The frontend will run on http://localhost:5173"
