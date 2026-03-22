@echo off
echo Stopping Decarva Shipping Integrated Portal...

echo.
echo Finding and killing processes on port 8800 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8800 ^| findstr LISTENING') do taskkill /f /pid %%a

echo.
echo Finding and killing processes on port 3800 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3800 ^| findstr LISTENING') do taskkill /f /pid %%a

echo.
echo Decarva servers have been stopped.
echo.
pause
