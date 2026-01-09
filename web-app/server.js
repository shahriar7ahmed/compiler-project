const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================
// API ENDPOINT: POST /api/compile
// Compiles source code using the C++ compiler
// ============================================
app.post('/api/compile', (req, res) => {
    const { sourceCode } = req.body;

    if (!sourceCode) {
        return res.status(400).json({
            success: false,
            error: 'No source code provided'
        });
    }

    console.log('Compiling code:', sourceCode.substring(0, 50) + '...');

    // Path to compiler executable (parent directory)
    const compilerPath = path.join(__dirname, '..', 'compiler_web_api.exe');

    // Spawn the compiler process
    const compiler = spawn(compilerPath);

    let output = '';
    let errorOutput = '';

    // Capture stdout
    compiler.stdout.on('data', (data) => {
        output += data.toString();
    });

    // Capture stderr
    compiler.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    // Handle process completion
    compiler.on('close', (code) => {
        if (code !== 0 && !output) {
            console.error('Compiler error:', errorOutput);
            return res.status(500).json({
                success: false,
                error: 'Compiler execution failed',
                details: errorOutput
            });
        }

        try {
            // Parse JSON output from compiler
            const result = JSON.parse(output);
            console.log('Compilation result:', result.success ? 'SUCCESS' : 'FAILED');
            res.json(result);
        } catch (err) {
            console.error('JSON parse error:', err.message);
            console.error('Compiler output:', output);
            res.status(500).json({
                success: false,
                error: 'Failed to parse compiler output',
                details: output
            });
        }
    });

    // Handle process errors
    compiler.on('error', (err) => {
        console.error('Failed to start compiler:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to start compiler',
            details: err.message
        });
    });

    // Send source code to compiler via stdin
    compiler.stdin.write(sourceCode);
    compiler.stdin.end();
});

// ============================================
// API ENDPOINT: GET /api/demos
// Returns list of available demo files
// ============================================
app.get('/api/demos', (req, res) => {
    const demosPath = path.join(__dirname, '..', 'demos');

    fs.readdir(demosPath, (err, files) => {
        if (err) {
            console.error('Error reading demos directory:', err);
            return res.status(500).json({
                success: false,
                error: 'Failed to read demos directory'
            });
        }

        // Filter for .txt files and create demo objects
        const demos = files
            .filter(file => file.endsWith('.txt'))
            .map(file => {
                // Create descriptive names from filenames
                let description = file.replace('.txt', '').replace(/_/g, ' ');

                // Add specific descriptions for known demos
                const descriptions = {
                    'demo1': 'Simple variable declaration',
                    'demo2': 'Arithmetic expressions',
                    'demo3': 'Complex expression',
                    'demo4': 'Comparison operators',
                    'demo5_optimization': 'Optimization showcase',
                    'demo_error1': 'Undefined variable error',
                    'demo_error2': 'Duplicate declaration error'
                };

                const basename = file.replace('.txt', '');
                description = descriptions[basename] || description;

                return {
                    name: file,
                    description: description
                };
            });

        res.json({ demos });
    });
});

// ============================================
// API ENDPOINT: GET /api/demo/:name
// Returns content of a specific demo file
// ============================================
app.get('/api/demo/:name', (req, res) => {
    const demoName = req.params.name;
    const demoPath = path.join(__dirname, '..', 'demos', demoName);

    // Security: Ensure the file is within demos directory
    const resolvedPath = path.resolve(demoPath);
    const demosDir = path.resolve(path.join(__dirname, '..', 'demos'));

    if (!resolvedPath.startsWith(demosDir)) {
        return res.status(403).json({
            success: false,
            error: 'Access denied'
        });
    }

    fs.readFile(demoPath, 'utf8', (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({
                    success: false,
                    error: 'Demo file not found'
                });
            }
            console.error('Error reading demo file:', err);
            return res.status(500).json({
                success: false,
                error: 'Failed to read demo file'
            });
        }

        res.json({
            name: demoName,
            content: content
        });
    });
});

// ============================================
// Root endpoint - API info
// ============================================
app.get('/api', (req, res) => {
    res.json({
        name: 'Educational Compiler API',
        version: '1.0.0',
        endpoints: [
            { method: 'POST', path: '/api/compile', description: 'Compile source code' },
            { method: 'GET', path: '/api/demos', description: 'List demo files' },
            { method: 'GET', path: '/api/demo/:name', description: 'Get demo file content' }
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🎓 Educational Compiler Web Server');
    console.log('='.repeat(50));
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api`);
    console.log('='.repeat(50));
});
