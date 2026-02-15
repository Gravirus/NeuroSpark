# Mac Installer Build Instructions

Since you're currently on Windows, you cannot build Mac installers directly. Here are the instructions for building Mac installers:

## Prerequisites (on Mac):
- macOS 10.15 or later
- Xcode Command Line Tools
- Go 1.21+
- Node.js 22 LTS
- Zig compiler
- Task (go-task/task)

## Build Steps:

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd neurospark
   ```

2. **Initialize the project**:
   ```bash
   task init
   ```

3. **Build Mac installers**:
   ```bash
   task package --mac
   ```

   Or manually:
   ```bash
   # Build backend components
   task build:backend
   
   # Build tsunami scaffold
   task build:tsunamiscaffold
   
   # Build frontend
   npm run build:prod
   
   # Create Mac installers (DMG and ZIP)
   npx electron-builder --config electron-builder.config.cjs --mac
   ```

4. **Find the installers**:
   The Mac installers will be created in the `make` directory:
   - `NeuroSpark-darwin-arm64-0.14.0.dmg` (Apple Silicon)
   - `NeuroSpark-darwin-x64-0.14.0.dmg` (Intel Mac)
   - `NeuroSpark-darwin-arm64-0.14.0.zip` (Apple Silicon)
   - `NeuroSpark-darwin-x64-0.14.0.zip` (Intel Mac)

## Alternative: Cross-compilation from Windows

You can also cross-compile for Mac from Windows using Zig, but code signing will need to be done on a Mac:

```bash
# Set environment variables
$env:GOOS="darwin"
$env:GOARCH="arm64"  # or "amd64" for Intel Mac
$env:CGO_ENABLED="1"
$env:CC="zig cc -target aarch64-macos"  # or "zig cc -target x86_64-macos" for Intel

# Build wavesrv
go build -tags "osusergo,sqlite_omit_load_extension" -ldflags "-X main.BuildTime=$(Get-Date -UFormat '%Y%m%d%H%M') -X main.WaveVersion=0.14.0" -o dist/bin/wavesrv.arm64 cmd/server/main-server.go

# Build wsh
$env:CGO_ENABLED="0"
go build -ldflags="-s -w -X main.BuildTime=$(Get-Date -UFormat '%Y%m%d%H%M') -X main.WaveVersion=0.14.0" -o dist/bin/wsh-0.14.0-darwin.arm64 cmd/wsh/main-wsh.go

# Build frontend and create package (requires Mac for final packaging)
npm run build:prod
npx electron-builder --config electron-builder.config.cjs --mac --x64 --arm64
```

Note: Code signing and notarization must be done on a Mac for production distribution.