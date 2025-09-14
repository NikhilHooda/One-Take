# 🚀 Quick Start Guide

## Option 1: Double-Click to Launch (Easiest)

1. **Double-click** `start-app.bat` (Windows Batch file)
   - This will open two command windows
   - One for the backend server
   - One for the frontend server

2. **Wait** for both servers to start (about 10-15 seconds)

3. **Open your browser** and go to: http://localhost:5173

## Option 2: PowerShell Script

1. **Right-click** on `start-app.ps1`
2. **Select** "Run with PowerShell"
3. **Open your browser** and go to: http://localhost:5173

## Option 3: Manual Commands

### Terminal 1 - Backend:
```powershell
cd "C:\Users\aryan\OneDrive\Documents\One Take\repo-reel-creator\backend"
node server.js
```

### Terminal 2 - Frontend:
```powershell
cd "C:\Users\aryan\OneDrive\Documents\One Take\repo-reel-creator"
npm run dev
```

## 🔑 Important: Add Your OpenAI API Key

Before testing storyboard generation:

1. **Open** `storyboard-creation\.env` in a text editor
2. **Replace** `your_openai_api_key_here` with your actual OpenAI API key
3. **Get your API key** from: https://platform.openai.com/api-keys

## 🧪 Test the Application

1. **Go to** http://localhost:5173
2. **Click** "Get Started"
3. **Enter** a GitHub URL (e.g., `https://github.com/facebook/react`)
4. **Enter** a website URL (e.g., `https://reactjs.org`)
5. **Click** "Generate Storyboard"

## 🛠️ Troubleshooting

**If the batch file doesn't work:**
- Try the PowerShell script instead
- Or use the manual commands

**If you get errors:**
- Make sure you're in the correct directory
- Try running `npm install` first in both directories

**If storyboard generation fails:**
- Make sure you've added your OpenAI API key
- Check that the backend is running on port 3001

## 📱 What You'll See

1. **Landing Page**: Beautiful homepage with "Get Started" button
2. **Form**: Input fields for GitHub and website URLs
3. **Generation**: Progress indicator while AI analyzes
4. **Storyboard**: Interactive flow diagram with detailed information
5. **Customization**: Chat interface to modify the storyboard

Enjoy creating storyboards! 🎬
