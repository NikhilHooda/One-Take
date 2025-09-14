@echo off
echo Starting Repo Reel Creator...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && node server.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo NOTE: If port 5173 is busy, Vite will automatically use the next available port.
echo Check the terminal window for the actual URL (e.g., http://localhost:8080)
echo.
echo Press any key to close this window...
pause > nul
