@echo off
echo =============================================
echo   HAUNTED BASEMENT CONTROL
echo =============================================
echo.
echo Starting server...

:: Start server
start "" cmd /k "node server.js"

:: Wait for server to start
timeout /t 2 /nobreak > nul

:: Open browser
start "" http://localhost:8080

echo.
echo Server is now running!
echo.
echo On other devices (like FireStick):
echo - Open a web browser
echo - Navigate to this computer's IP address with port 8080
echo - Example: http://192.168.1.100:8080
echo.
echo Don't close the black command window that opened.
echo. 