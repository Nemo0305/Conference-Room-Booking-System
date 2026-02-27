@echo off
setlocal

echo Stopping existing services on ports 5000, 5173, 3001...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do taskkill /f /pid %%a

timeout /t 2 /nobreak > nul

echo Starting Backend API...
start "Backend API" /min cmd /c "cd backend && npm start"

echo Starting User Frontend (Port 5173)...
start "User Frontend" /min cmd /c "cd frontend-user && npm run dev"

echo Starting Admin Frontend (Port 3001)...
start "Admin Frontend" /min cmd /c "cd frontend-admin && npm run dev -- -p 3001"

echo.
echo ==========================================
echo Conference Room Booking System
echo ==========================================
echo Backend:       http://localhost:5000
echo User Frontend:  http://localhost:5173
echo Admin Frontend: http://localhost:3001
echo ==========================================
echo.
echo Services are starting in minimized windows.
echo Please wait about 10-15 seconds for Next.js and Vite to warm up.

exit /b 0
