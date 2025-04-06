@echo off
echo Checking users in the database...

REM Run the PowerShell script to show users
powershell -ExecutionPolicy Bypass -File "src\main\resources\db\show-users.ps1"

pause 