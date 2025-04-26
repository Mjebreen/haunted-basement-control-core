@echo off
echo =============================================
echo   HAUNTED BASEMENT CONTROL LAUNCHER
echo =============================================
echo.

:: Check if the executable exists in the current directory
if exist "HauntedBasementControl.exe" (
  goto :StartProgram
)

:: Check if executable exists in dist-package directory
if exist "dist-package\HauntedBasementControl.exe" (
  echo Found executable in dist-package folder
  copy "dist-package\HauntedBasementControl.exe" "."
  goto :StartProgram
)

:: Check if we have a zip file to extract
if exist "dist-package.zip" (
  echo Extracting application from package...
  powershell -command "Expand-Archive -Force 'dist-package.zip' 'temp-extract'"
  if exist "temp-extract\HauntedBasementControl.exe" (
    copy "temp-extract\HauntedBasementControl.exe" "."
    if exist "temp-extract\auto-launcher.bat" (
      copy "temp-extract\auto-launcher.bat" "."
    )
    rmdir /s /q "temp-extract"
    goto :StartProgram
  )
  rmdir /s /q "temp-extract"
)

:: If we got here, we couldn't find the executable
echo ERROR: Could not find HauntedBasementControl.exe
echo Please make sure the executable file is in the same folder as this script.
echo.
echo Press any key to exit...
pause > nul
exit

:StartProgram
echo Starting Haunted Basement Control...

:: Start the executable in the background
start "" "HauntedBasementControl.exe"

:: Wait a moment for the server to start
echo Waiting for server to start...
timeout /t 5 /nobreak > nul

:: Open browser to access the application
echo Opening browser...
start "" http://localhost:8080

echo.
echo If the browser doesn't open automatically:
echo 1) Wait a few more seconds
echo 2) Open your browser and go to: http://localhost:8080
echo.
echo Press any key to close this window...
pause > nul 