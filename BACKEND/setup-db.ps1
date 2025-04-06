Write-Host "Setting up PostgreSQL database for Mira Textile Management System..." -ForegroundColor Green

# Check if PostgreSQL is installed
try {
    $psqlPath = Get-Command psql -ErrorAction Stop
    Write-Host "PostgreSQL found at: $($psqlPath.Source)" -ForegroundColor Green
} catch {
    Write-Host "PostgreSQL is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install PostgreSQL and add it to your PATH." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Create database and set password
Write-Host "Creating database and setting up user..." -ForegroundColor Green

# Set password for postgres user
try {
    $result = & psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to set password"
    }
    Write-Host "Password set successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to set password for postgres user." -ForegroundColor Red
    Write-Host "Please make sure PostgreSQL is running and the postgres user exists." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Create database
try {
    $result = & psql -U postgres -c "CREATE DATABASE mira_textile_db;"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Database already exists or failed to create." -ForegroundColor Yellow
        Write-Host "Continuing..." -ForegroundColor Green
    } else {
        Write-Host "Database created successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "Error creating database: $_" -ForegroundColor Red
}

Write-Host "Database setup complete!" -ForegroundColor Green
Write-Host "You can now start the application." -ForegroundColor Green
Read-Host "Press Enter to exit" 