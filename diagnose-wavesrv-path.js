// Diagnostic script to check wavesrv path resolution
// Save this as diagnose-wavesrv-path.js and run it from the installed app directory

const path = require('path');
const fs = require('fs');

console.log('=== NeuroSpark Path Diagnosis ===\n');

// Simulate the path resolution logic from emain-platform.ts
const isDev = false; // Production mode
const unameArch = process.arch;
const wavesrvBinName = `wavesrv.${unameArch}${process.platform === 'win32' ? '.exe' : ''}`;

console.log('System Info:');
console.log('- Platform:', process.platform);
console.log('- Architecture:', unameArch);
console.log('- Is Packaged:', !process.defaultApp);
console.log('- Resources Path:', process.resourcesPath);
console.log('- App Path:', process.execPath);
console.log();

// Path resolution functions (matching emain-platform.ts)
function getElectronAppBasePath() {
    if (isDev) {
        return path.dirname(__dirname);
    }
    return path.dirname(process.execPath);
}

function getElectronAppUnpackedBasePath() {
    return getElectronAppBasePath().replace("app.asar", "app.asar.unpacked");
}

function getWaveSrvPath() {
    if (process.platform === "win32") {
        const winBinName = `${wavesrvBinName}`;
        const appPath = path.join(getElectronAppUnpackedBasePath(), "bin", winBinName);
        return `${appPath}`;
    }
    return path.join(getElectronAppUnpackedBasePath(), "bin", wavesrvBinName);
}

// Check paths
const basePath = getElectronAppBasePath();
const unpackedPath = getElectronAppUnpackedBasePath();
const wavesrvPath = getWaveSrvPath();

console.log('Path Resolution:');
console.log('- Base Path:', basePath);
console.log('- Unpacked Path:', unpackedPath);
console.log('- Expected wavesrv Path:', wavesrvPath);
console.log();

// Check if files exist
console.log('File Existence Check:');
console.log('- Base Path exists:', fs.existsSync(basePath));
console.log('- Unpacked Path exists:', fs.existsSync(unpackedPath));

if (fs.existsSync(unpackedPath)) {
    const binPath = path.join(unpackedPath, 'bin');
    console.log('- Bin directory exists:', fs.existsSync(binPath));
    
    if (fs.existsSync(binPath)) {
        const files = fs.readdirSync(binPath);
        console.log('- Files in bin directory:', files);
        
        const wavesrvExists = fs.existsSync(wavesrvPath);
        console.log('- wavesrv exists:', wavesrvExists);
        
        if (wavesrvExists) {
            const stats = fs.statSync(wavesrvPath);
            console.log('- wavesrv size:', stats.size, 'bytes');
            console.log('- wavesrv permissions:', stats.mode.toString(8));
        }
    }
} else {
    console.log('- ERROR: Unpacked path does not exist!');
    
    // Try to find where the files actually are
    console.log('\nSearching for wavesrv binary...');
    const searchPaths = [
        path.join(process.resourcesPath, 'app.asar.unpacked', 'bin'),
        path.join(path.dirname(process.execPath), 'resources', 'app.asar.unpacked', 'bin'),
        path.join(path.dirname(process.execPath), '..', 'Resources', 'app.asar.unpacked', 'bin')
    ];
    
    for (const searchPath of searchPaths) {
        if (fs.existsSync(searchPath)) {
            console.log('- Found at:', searchPath);
            const files = fs.readdirSync(searchPath);
            console.log('  Files:', files);
            break;
        }
    }
}

console.log('\n=== End Diagnosis ===');