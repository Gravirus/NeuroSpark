# NeuroSpark Silent Failure Troubleshooting Guide

## Problem: Application installs successfully but does nothing when launched

This is a common issue with Electron applications where the app works in development mode (`task start`) but fails silently in production builds.

## Immediate Diagnostic Steps

### 1. Check Windows Event Viewer
```
Press Win + R → type "eventvwr.msc" → Enter
Navigate to: Windows Logs → Application
Look for errors around the time you tried to launch NeuroSpark
```

### 2. Run from Command Line
```cmd
cd "C:\Program Files\NeuroSpark"
NeuroSpark.exe
```
This will show any console errors that are normally hidden.

### 3. Check Log Files
Look for logs in:
- `%LOCALAPPDATA%\neurospark\logs`
- `%APPDATA%\neurospark\logs`

## Common Root Causes

### 1. **Antivirus/Firewall Interference** ⚠️ Most Common
Many antivirus programs (especially Windows Defender) quarantine or block Electron applications.

**Solutions:**
- Add NeuroSpark to Windows Defender exclusions:
  1. Windows Security → Virus & threat protection
  2. Manage settings → Add or remove exclusions
  3. Add folder: `C:\Program Files\NeuroSpark`
- Temporarily disable real-time protection to test
- Check quarantine history for blocked files

### 2. **Missing Visual C++ Redistributables**
The Go backend binaries require Visual C++ runtime libraries.

**Solution:**
- Download and install Microsoft Visual C++ Redistributable from Microsoft's website
- Install both x64 and x86 versions

### 3. **Path Resolution Issues**
Production builds use different file structures than development.

**Enhanced Debugging Added:**
The updated code now includes detailed path checking that will show exactly what's failing.

### 4. **Corrupted Installation**
Files may not have been extracted properly during installation.

**Solution:**
- Completely uninstall NeuroSpark
- Delete remaining folders:
  - `C:\Program Files\NeuroSpark`
  - `%LOCALAPPDATA%\neurospark`
  - `%APPDATA%\neurospark`
- Reinstall fresh

## Diagnostic Tools Provided

### 1. Path Diagnosis Script
Run `diagnose-wavesrv-path.js` from the installed directory to check file locations:

```cmd
cd "C:\Program Files\NeuroSpark"
node diagnose-wavesrv-path.js
```

This will show:
- Expected file paths
- Whether files exist
- Alternative locations where files might be found

### 2. Enhanced Error Handling
The updated code now provides:
- Detailed startup logging
- User-friendly error dialogs
- Specific error messages for common issues

## Step-by-Step Troubleshooting

### Phase 1: Basic Checks
1. ✅ Restart your computer
2. ✅ Run as Administrator
3. ✅ Check Windows Event Viewer for errors
4. ✅ Try running from command line

### Phase 2: Antivirus Investigation
1. ✅ Check Windows Defender quarantine
2. ✅ Add exclusions for NeuroSpark folder
3. ✅ Temporarily disable real-time protection
4. ✅ Try different antivirus software

### Phase 3: System Dependencies
1. ✅ Install/update Visual C++ Redistributables
2. ✅ Install .NET Framework if missing
3. ✅ Check Windows updates

### Phase 4: Clean Installation
1. ✅ Complete uninstall
2. ✅ Delete all NeuroSpark folders
3. ✅ Reboot
4. ✅ Fresh install

### Phase 5: Advanced Diagnostics
1. ✅ Run the diagnosis script
2. ✅ Check file permissions
3. ✅ Verify digital signatures
4. ✅ Test on different user account

## What the Updated Code Fixes

The enhanced error handling now provides:

1. **Better Path Resolution Logging** - Shows exactly where the app is looking for files
2. **File Existence Checking** - Verifies critical files exist before trying to use them
3. **User-Friendly Error Messages** - Tells users what went wrong and how to fix it
4. **Antivirus Detection Hints** - Suggests checking antivirus when files are missing
5. **Permission Checking** - Verifies files are executable before trying to run them

## Emergency Recovery

If nothing else works:

1. **Try the portable ZIP version** instead of installer
2. **Run from different location** (Downloads folder, Desktop)
3. **Create new Windows user account** and test there
4. **Boot in Safe Mode** and try launching
5. **Use Process Monitor** to see what files the app is trying to access

## Prevention for Future Builds

To prevent this issue in future releases:

1. **Bundle Visual C++ Redistributables** with installer
2. **Add comprehensive pre-flight checks** 
3. **Implement better crash reporting**
4. **Create detailed installation logs**
5. **Add automatic repair functionality**

The enhanced code in this repository now provides much better diagnostics for these silent failure scenarios.