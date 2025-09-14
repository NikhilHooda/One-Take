# Repo Reel Creator - Setup Instructions

This application integrates a React frontend with a Python-based storyboard generation system to create demo videos from GitHub repositories and deployed websites.

## Prerequisites

- **Node.js 16+** - For the frontend and backend
- **Python 3.9+** - For the storyboard generation system
- **OpenAI API Key** - Required for AI-powered storyboard generation

## Quick Setup

### Windows
```powershell
# Run the PowerShell setup script
.\setup.ps1
```

### Linux/macOS
```bash
# Run the bash setup script
chmod +x setup.sh
./setup.sh
```

## Manual Setup

### 1. Install Frontend Dependencies
```bash
cd repo-reel-creator
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Setup Python Environment
```bash
cd ../storyboard-creation
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
python -m playwright install
```

### 4. Configure Environment Variables
Create a `.env` file in the `storyboard-creation` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.2
OPENAI_TIMEOUT_SECONDS=120
```

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3001`

### 2. Start the Frontend Development Server
```bash
cd .. # (back to repo-reel-creator root)
npm run dev
```
The frontend will run on `http://localhost:5173`

## How It Works

1. **User Input**: User provides GitHub repository URL and optional deployed website URL
2. **Website Analysis**: Python script uses Playwright to explore the website and extract structure
3. **AI Generation**: OpenAI analyzes the website data and generates a detailed storyboard
4. **Visual Display**: React frontend displays the storyboard as an interactive flow diagram
5. **Customization**: Users can modify the storyboard through the chat interface

## API Endpoints

- `POST /api/generate-storyboard` - Generate storyboard from URLs
- `GET /api/storyboard/:id` - Retrieve saved storyboard
- `GET /health` - Health check

## Troubleshooting

### Python/Playwright Issues
```bash
# Reinstall Playwright browsers
cd storyboard-creation
python -m playwright install
```

### Backend Connection Issues
- Ensure the backend is running on port 3001
- Check that the frontend is configured to use the correct API URL
- Verify CORS settings in the backend

### OpenAI API Issues
- Verify your API key is correctly set in the `.env` file
- Check that you have sufficient API credits
- Ensure the API key has access to the required models

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
npm run dev  # Uses Vite for hot reload
```

## Project Structure

```
repo-reel-creator/
├── src/                    # React frontend
├── backend/                # Node.js/Express API
├── storyboard-creation/    # Python storyboard generation
│   ├── storyboardpy/       # Main Python package
│   ├── examples/           # Example outputs
│   └── requirements.txt    # Python dependencies
├── public/                 # Static assets
└── package.json           # Frontend dependencies
```
