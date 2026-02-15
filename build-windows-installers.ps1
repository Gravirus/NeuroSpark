# Build Windows Installers
# This script builds NeuroSpark installers for Windows

Write-Host "Starting NeuroSpark Windows installer build..." -ForegroundColor Green

# Check if required tools are installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Go
try {
    $goVersion = go version
    Write-Host "Go found: $goVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Go is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check Zig
try {
    $zigVersion = zig version
    Write-Host "Zig found: $zigVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Zig is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check Task (optional - we can install it)
try {
    $taskVersion = task --version
    Write-Host "Task found: $taskVersion" -ForegroundColor Green
} catch {
    Write-Host "Task not found, installing..." -ForegroundColor Yellow
    go install github.com/go-task/task/v3/cmd/task@latest
    $env:PATH += ";$env:USERPROFILE\go\bin"
}

Write-Host "All prerequisites checked!" -ForegroundColor Green

# Clean previous builds
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path "make") { Remove-Item -Recurse -Force "make" }

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
go mod tidy

# Generate required files
Write-Host "Generating required files..." -ForegroundColor Yellow
go run cmd/generateschema/main-generateschema.go
go run cmd/generatets/main-generatets.go
go run cmd/generatego/main-generatego.go

# Build backend components
Write-Host "Building backend components..." -ForegroundColor Yellow

# Build wavesrv for Windows
$env:CGO_ENABLED = "1"
$env:GOOS = "windows"
$env:GOARCH = "amd64"
$env:CC = "zig cc -target x86_64-windows-gnu"
go build -tags "osusergo,sqlite_omit_load_extension" -ldflags "-X main.BuildTime=$(Get-Date -UFormat '%Y%m%d%H%M') -X main.WaveVersion=0.14.0" -o dist/bin/wavesrv.x64.exe cmd/server/main-server.go

# Build wsh for Windows
$env:CGO_ENABLED = "0"
go build -ldflags="-s -w -X main.BuildTime=$(Get-Date -UFormat '%Y%m%d%H%M') -X main.WaveVersion=0.14.0" -o dist/bin/wsh-0.14.0-windows.x64.exe cmd/wsh/main-wsh.go

# Build tsunami scaffold
Write-Host "Building tsunami scaffold..." -ForegroundColor Yellow
Set-Location tsunami/frontend
npm run build
Set-Location ../..
Copy-Item -Recurse -Force -Path tsunami/frontend/scaffold -Destination dist/tsunamiscaffold
Copy-Item -Path tsunami/templates/empty-gomod.tmpl -Destination dist/tsunamiscaffold/go.mod

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build:prod

# Create installers
Write-Host "Creating Windows installers..." -ForegroundColor Yellow
npx electron-builder --config electron-builder.config.cjs --win --x64

# Move installers to separate folder
Write-Host "Organizing installers..." -ForegroundColor Yellow
if (!(Test-Path "installers")) { New-Item -ItemType Directory -Force -Path "installers" }
Copy-Item -Path "make/NeuroSpark-win32-x64-0.14.0.*" -Destination "installers/"

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "Installers are located in the 'installers' folder:" -ForegroundColor Yellow
Get-ChildItem "installers"

Write-Host ""
Write-Host "For Mac installers, see MAC_BUILD_INSTRUCTIONS.md" -ForegroundColor Cyan