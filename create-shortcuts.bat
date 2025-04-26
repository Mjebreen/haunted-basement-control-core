@echo off
echo =============================================
echo   CREATING DESKTOP SHORTCUTS
echo =============================================
echo.

:: Create desktop shortcut for auto-launcher
echo Creating desktop shortcut...

:: Get the current directory and the desktop path
set "CURRENT_DIR=%CD%"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"

:: Create the shortcut file
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP_DIR%\Haunted Basement Control.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%CURRENT_DIR%\auto-launcher.bat" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%CURRENT_DIR%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Start Haunted Basement Control" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "%CURRENT_DIR%\HauntedBasementControl.exe,0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"

:: Run the VBScript to create the shortcut
cscript //nologo "%TEMP%\CreateShortcut.vbs"
del "%TEMP%\CreateShortcut.vbs"

echo.
echo Desktop shortcut created successfully!
echo.
echo =============================================
echo   SETUP COMPLETE
echo =============================================
echo.
echo The application is now ready to use!
echo.
echo 1. A shortcut has been created on your desktop
echo 2. Simply double-click "Haunted Basement Control" on your desktop to start
echo.
echo Press any key to exit...
pause > nul 