# Check if PostgreSQL service is running
$postgresService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if ($postgresService -eq $null) {
    Write-Host "PostgreSQL service not found. Please install PostgreSQL."
    exit 1
}

if ($postgresService.Status -ne "Running") {
    Write-Host "PostgreSQL service is not running. Starting service..."
    Start-Service -Name $postgresService.Name
    Start-Sleep -Seconds 5
}

# Check if the database exists
$dbExists = psql -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname='mira_textile_db'" | Out-String

if ($dbExists -match "1") {
    Write-Host "Database 'mira_textile_db' already exists."
} else {
    Write-Host "Creating database 'mira_textile_db'..."
    psql -U postgres -c "CREATE DATABASE mira_textile_db"
}

Write-Host "PostgreSQL is running and database is ready." 