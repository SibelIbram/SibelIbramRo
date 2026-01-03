# Quick Mobile Testing Server
# This script starts a local web server so you can test on mobile devices

$port = 8000
$folder = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mobile Testing Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get IP address
try {
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
        $_.InterfaceAlias -notlike "*Loopback*" -and 
        $_.IPAddress -notlike "169.254.*" -and
        $_.IPAddress -notlike "127.*"
    }).IPAddress | Select-Object -First 1
    
    if (-not $ipAddress) {
        $ipAddress = "localhost"
    }
} catch {
    $ipAddress = "localhost"
}

Write-Host "Starting web server..." -ForegroundColor Green
Write-Host "Port: $port" -ForegroundColor Yellow
Write-Host "Folder: $folder" -ForegroundColor Yellow
Write-Host ""

# Check for Python
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "Python 3") {
        Write-Host "Using Python 3..." -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Access from Mobile Device:" -ForegroundColor Yellow
        Write-Host "  http://$ipAddress`:$port" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Make sure your mobile device is on the same WiFi network!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
        Write-Host ""
        
        Set-Location $folder
        python -m http.server $port
    } elseif ($pythonVersion -match "Python 2") {
        Write-Host "Using Python 2..." -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Access from Mobile Device:" -ForegroundColor Yellow
        Write-Host "  http://$ipAddress`:$port" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Make sure your mobile device is on the same WiFi network!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
        Write-Host ""
        
        Set-Location $folder
        python -m SimpleHTTPServer $port
    }
}
# Check for Node.js and http-server
elseif (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Using Node.js..." -ForegroundColor Green
    
    # Check if http-server is installed
    if (-not (Get-Command http-server -ErrorAction SilentlyContinue)) {
        Write-Host "Installing http-server (one-time setup)..." -ForegroundColor Yellow
        npm install -g http-server
        Write-Host ""
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Access from Mobile Device:" -ForegroundColor Yellow
    Write-Host "  http://$ipAddress`:$port" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Make sure your mobile device is on the same WiFi network!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host ""
    
    Set-Location $folder
    http-server -p $port --cors
}
else {
    Write-Host "ERROR: Python or Node.js not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install one of the following:" -ForegroundColor Yellow
    Write-Host "  1. Python 3: https://www.python.org/downloads/" -ForegroundColor White
    Write-Host "  2. Node.js: https://nodejs.org/" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use VS Code Live Server extension instead." -ForegroundColor Yellow
    Write-Host ""
    pause
}

