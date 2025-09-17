#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = '.claude';
const OVERRIDE_DIR = '.claude-ext';
const OUTPUT_FILE = 'diff-report.html';

function findOverrideFiles() {
    console.log('🔍 Finding override files...');
    
    const overrideFiles = [];
    
    function traverseDirectory(dir, relativePath = '') {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const relativeItemPath = path.join(relativePath, item);
            
            if (fs.statSync(itemPath).isDirectory()) {
                traverseDirectory(itemPath, relativeItemPath);
            } else if (item.endsWith('.md')) {
                const basePath = path.join(BASE_DIR, relativeItemPath);
                if (fs.existsSync(basePath)) {
                    overrideFiles.push({
                        relative: relativeItemPath,
                        override: itemPath,
                        base: basePath
                    });
                }
            }
        }
    }
    
    traverseDirectory(OVERRIDE_DIR);
    return overrideFiles;
}

function generateHtmlReport(overrideFiles) {
    console.log('🎨 Generating diff report...');
    
    // Prepare file data for Monaco
    const fileData = overrideFiles.map(file => {
        const baseContent = fs.readFileSync(file.base, 'utf8');
        const overrideContent = fs.readFileSync(file.override, 'utf8');
        
        return {
            name: file.relative,
            original: baseContent,
            modified: overrideContent
        };
    });
    
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CCPM Override Diff Report - Monaco Editor</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f6f8fa;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0 0 10px 0;
            color: #24292e;
        }
        .header p {
            margin: 5px 0;
            color: #586069;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin-top: 15px;
        }
        .stat {
            background: #f1f8ff;
            padding: 10px 15px;
            border-radius: 6px;
            border-left: 4px solid #0366d6;
        }
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #0366d6;
        }
        .stat-label {
            font-size: 12px;
            color: #586069;
            text-transform: uppercase;
        }
        .file-selector {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .file-selector h3 {
            margin: 0 0 15px 0;
            color: #24292e;
        }
        .file-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 15px;
        }
        .file-tab {
            padding: 8px 16px;
            background: #f6f8fa;
            border: 1px solid #d8dee4;
            border-radius: 6px;
            cursor: pointer;
            font-family: 'SFMono-Regular', Consolas, monospace;
            font-size: 14px;
            transition: all 0.2s;
        }
        .file-tab:hover {
            background: #e1e7ec;
        }
        .file-tab.active {
            background: #0366d6;
            color: white;
            border-color: #0366d6;
        }
        .editor-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
            height: 600px;
        }
        .editor-title {
            background: #f6f8fa;
            padding: 10px 16px;
            border-bottom: 1px solid #d8dee4;
            font-weight: 600;
            color: #24292e;
            font-family: 'SFMono-Regular', Consolas, monospace;
        }
        #diffEditor {
            height: calc(100% - 41px);
        }
        .powered-by {
            text-align: center;
            margin-top: 20px;
            color: #586069;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔄 CCPM Override Diff Report</h1>
        <p><strong>Comparison:</strong> <code>.claude-ext/</code> overrides vs <code>.claude/</code> base files</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Engine:</strong> Monaco Editor (VS Code Editor)</p>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${overrideFiles.length}</div>
                <div class="stat-label">Override Files</div>
            </div>
            <div class="stat">
                <div class="stat-number">${overrideFiles.filter(f => f.relative.includes('agents')).length}</div>
                <div class="stat-label">Agent Overrides</div>
            </div>
            <div class="stat">
                <div class="stat-number">${overrideFiles.filter(f => f.relative.includes('commands')).length}</div>
                <div class="stat-label">Command Overrides</div>
            </div>
        </div>
    </div>
    
    <div class="file-selector">
        <h3>📄 Select File to Compare:</h3>
        <div class="file-tabs">
            ${overrideFiles.map((file, index) => `
                <div class="file-tab ${index === 0 ? 'active' : ''}" data-file-index="${index}">
                    ${file.relative}
                </div>
            `).join('')}
        </div>
    </div>
    
    <div class="editor-container">
        <div class="editor-title" id="editorTitle">
            ${overrideFiles[0]?.relative || 'No files to compare'}
        </div>
        <div id="diffEditor"></div>
    </div>
    
    <div class="powered-by">
        Powered by Monaco Editor - The same editor that powers VS Code and GitHub Codespaces
    </div>

    <!-- Monaco Editor -->
    <script src="https://unpkg.com/monaco-editor@latest/min/vs/loader.js"></script>
    <script>
        const fileData = ${JSON.stringify(fileData, null, 2)};
        let diffEditor;
        let currentFileIndex = 0;

        require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });
        
        require(['vs/editor/editor.main'], function () {
            console.log('Monaco Editor loaded successfully');
            console.log('File data:', fileData);
            
            try {
                // Initialize Monaco diff editor
                diffEditor = monaco.editor.createDiffEditor(document.getElementById('diffEditor'), {
                    originalEditable: false,
                    readOnly: true,
                    renderSideBySide: true,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    minimap: { enabled: false },
                    wordWrap: 'on',
                    diffWordWrap: 'on',
                    theme: 'vs', // GitHub-like theme
                    fontSize: 13,
                    lineHeight: 20,
                    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
                    // GitHub-style diff options
                    renderIndicators: true,
                    renderMarginRevertIcon: false,
                    diffAlgorithm: 'smart',
                    ignoreTrimWhitespace: true,
                    renderWhitespace: 'none',
                    hideUnchangedRegions: {
                        enabled: true,
                        minimumLineCount: 3,
                        contextLineCount: 3
                    }
                });
                
                console.log('Diff editor created successfully');

                // Load first file
                if (fileData.length > 0) {
                    console.log('Loading first file:', fileData[0].name);
                    loadFile(0);
                }

                // File tab click handlers
                document.querySelectorAll('.file-tab').forEach(tab => {
                    console.log('Adding click listener to tab:', tab.textContent.trim());
                    tab.addEventListener('click', function() {
                        const fileIndex = parseInt(this.dataset.fileIndex);
                        console.log('Tab clicked, file index:', fileIndex);
                        selectFile(fileIndex);
                    });
                });
                
                console.log('All event listeners added');
                
            } catch (error) {
                console.error('Error initializing Monaco Editor:', error);
            }
        }, function(error) {
            console.error('Failed to load Monaco Editor:', error);
        });

        function loadFile(index) {
            console.log('loadFile called with index:', index);
            
            if (!fileData[index]) {
                console.error('No file data for index:', index);
                return;
            }
            
            if (!diffEditor) {
                console.error('Diff editor not initialized');
                return;
            }
            
            try {
                const file = fileData[index];
                console.log('Loading file:', file.name);
                
                // Dispose existing models to prevent memory leaks
                const currentModel = diffEditor.getModel();
                if (currentModel) {
                    if (currentModel.original) currentModel.original.dispose();
                    if (currentModel.modified) currentModel.modified.dispose();
                }
                
                // Create models for original and modified content
                const originalModel = monaco.editor.createModel(
                    file.original, 
                    'markdown', // Language for syntax highlighting
                    monaco.Uri.parse(\`file:///\${file.name}-original\`)
                );
                
                const modifiedModel = monaco.editor.createModel(
                    file.modified, 
                    'markdown',
                    monaco.Uri.parse(\`file:///\${file.name}-modified\`)
                );
                
                console.log('Models created, setting on diff editor');

                // Set the models for the diff editor
                diffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });

                // Update title
                document.getElementById('editorTitle').textContent = file.name;
                console.log('File loaded successfully:', file.name);
                
            } catch (error) {
                console.error('Error loading file:', error);
            }
        }

        function selectFile(index) {
            console.log('selectFile called with index:', index);
            
            try {
                // Update active tab
                document.querySelectorAll('.file-tab').forEach(tab => tab.classList.remove('active'));
                const activeTab = document.querySelector(\`[data-file-index="\${index}"]\`);
                
                if (!activeTab) {
                    console.error('Could not find tab for index:', index);
                    return;
                }
                
                activeTab.classList.add('active');
                console.log('Active tab updated');
                
                // Load the selected file
                currentFileIndex = index;
                loadFile(index);
                
            } catch (error) {
                console.error('Error selecting file:', error);
            }
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && currentFileIndex > 0) {
                selectFile(currentFileIndex - 1);
            } else if (e.key === 'ArrowRight' && currentFileIndex < fileData.length - 1) {
                selectFile(currentFileIndex + 1);
            }
        });
    </script>
</body>
</html>`;
    
    return htmlTemplate;
}

function main() {
    console.log('🚀 Starting CCPM Diff Report Generator');
    console.log(`📁 Base directory: ${BASE_DIR}`);
    console.log(`📁 Override directory: ${OVERRIDE_DIR}`);
    
    // Find all override files
    const overrideFiles = findOverrideFiles();
    
    if (overrideFiles.length === 0) {
        console.log('ℹ️  No override files found');
        return;
    }
    
    console.log(`✅ Found ${overrideFiles.length} override files:`);
    overrideFiles.forEach(file => {
        console.log(`   📝 ${file.relative}`);
    });
    
    // Generate HTML report
    const htmlReport = generateHtmlReport(overrideFiles);
    
    // Write report to file
    fs.writeFileSync(OUTPUT_FILE, htmlReport);
    
    console.log(`\n✅ Report generated: ${OUTPUT_FILE}`);
    console.log(`🌐 Opening report in browser...`);
    
    // Open in browser
    try {
        execSync(`open "${OUTPUT_FILE}"`);
    } catch (error) {
        console.log(`💡 Manual open: file://${path.resolve(OUTPUT_FILE)}`);
    }
}

if (require.main === module) {
    main();
}

module.exports = { findOverrideFiles, generateHtmlReport };