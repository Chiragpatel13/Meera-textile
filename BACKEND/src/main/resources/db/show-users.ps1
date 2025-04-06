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
    Write-Host "Database 'mira_textile_db' exists. Showing users..."
    
    # Run the SQL query to show users
    $users = psql -U postgres -d mira_textile_db -c "SELECT user_id, username, full_name, email, role, is_active, created_at FROM users ORDER BY created_at DESC" | Out-String
    
    if ($users -match "user_id") {
        Write-Host "Users found in the database:"
        Write-Host $users
    } else {
        Write-Host "No users found in the database."
    }
} else {
    Write-Host "Database 'mira_textile_db' does not exist."
} 