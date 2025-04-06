Write-Host "Starting Mira Textile Management System..." -ForegroundColor Green

# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    $listener = $null
    try {
        $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $port)
        $listener.Start()
        return $false
    } catch {
        return $true
    } finally {
        if ($listener) {
            $listener.Stop()
        }
    }
}

# Check if required ports are available
$frontendPort = 3000
$backendPort = 8080

if (Test-PortInUse $frontendPort) {
    Write-Host "Port $frontendPort is already in use. Please free up the port and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (Test-PortInUse $backendPort) {
    Write-Host "Port $backendPort is already in use. Please free up the port and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd BACKEND; ./mvnw spring-boot:run"

# Wait for backend to start
Write-Host "Waiting for backend server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd FRONTEND; npm start"

Write-Host "`nServers are starting up..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C in each window to stop the servers when needed." -ForegroundColor Yellow 