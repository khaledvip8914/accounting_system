@echo off
title Accounting Software - Production Server
echo ==============================================
echo    Starting Your Accounting System...
echo ==============================================
echo.
echo  [1/2] Checking Node.js environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! Please install it first.
    pause
    exit /b
)

echo  [2/2] Launching server at http://localhost:3000
echo.
echo  KEEP THIS WINDOW OPEN while using the program.
echo  To STOP the server, press Ctrl+C or close this window.
echo.
node server.js
pause
