@echo off
echo Setting up PostgreSQL database for Mira Textile Management System...

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo PostgreSQL is not installed or not in PATH.
    echo Please install PostgreSQL and add it to your PATH.
    pause
    exit /b 1
)

REM Create database and set password
echo Creating database and setting up user...
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
if %ERRORLEVEL% neq 0 (
    echo Failed to set password for postgres user.
    echo Please make sure PostgreSQL is running and the postgres user exists.
    pause
    exit /b 1
)

psql -U postgres -c "CREATE DATABASE mira_textile_db;"
if %ERRORLEVEL% neq 0 (
    echo Database already exists or failed to create.
    echo Continuing...
)

echo Database setup complete!
echo You can now start the application.
pause 