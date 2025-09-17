#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_FILE = 'fork-comparison-report.html';

function fetchUpstream() {
    try {
        console.log('🔄 Fetching latest from upstream...');
        execSync('git fetch upstream', { stdio: 'inherit' });
    } catch (error) {
        console.warn('⚠️  Could not fetch upstream. Using cached refs.');
    }
}

function getFileList(ref) {
    try {
        const output = execSync(`git ls-tree -r --name-only ${ref}`, { encoding: 'utf8' });
        return new Set(output.trim().split('\n').filter(f => f));
    } catch (error) {
        console.error(`❌ Error getting file list for ${ref}:`, error.message);
        return new Set();
    }
}

function getFileChanges() {
    try {
        const output = execSync('git diff --name-status upstream/main...HEAD', { encoding: 'utf8' });
        const changes = {};
        
        output.trim().split('\n').forEach(line => {
            if (line) {
                const [status, file] = line.split('\t');
                changes[file] = status;
            }
        });
        
        return changes;
    } catch (error) {
        console.error('❌ Error getting file changes:', error.message);
        return {};
    }
}

function buildFileTree(files, changes) {
    const tree = {};
    
    files.forEach(filePath => {
        const parts = filePath.split('/');
        let current = tree;
        
        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {
                    type: index === parts.length - 1 ? 'file' : 'directory',
                    children: {},
                    path: parts.slice(0, index + 1).join('/'),
                    status: changes[filePath] || 'unchanged'
                };
            }
            current = current[part].children;
        });
    });
    
    return tree;
}

function getTreeStats(tree) {
    const stats = { added: 0, modified: 0, deleted: 0, unchanged: 0, directories: 0, files: 0 };
    
    function traverse(node) {
        if (node.type === 'file') {
            stats.files++;
            if (node.status === 'A') stats.added++;
            else if (node.status === 'M') stats.modified++;
            else if (node.status === 'D') stats.deleted++;
            else stats.unchanged++;
        } else {
            stats.directories++;
        }
        
        Object.values(node.children).forEach(traverse);
    }
    
    Object.values(tree).forEach(traverse);
    return stats;
}

function renderTreeNode(name, node, depth = 0) {
    const indent = '  '.repeat(depth);
    const isDirectory = node.type === 'directory';
    const statusIcon = getStatusIcon(node.status);
    const statusClass = getStatusClass(node.status);
    
    let html = `<div class="tree-node ${statusClass}" data-path="${node.path}" data-type="${node.type}" data-status="${node.status}">`;
    html += `<div class="tree-item" style="padding-left: ${depth * 20}px;">`;
    
    if (isDirectory && Object.keys(node.children).length > 0) {
        html += `<span class="tree-toggle">▶</span>`;
    } else {
        html += `<span class="tree-spacer"></span>`;
    }
    
    html += `<span class="tree-icon">${isDirectory ? '📁' : '📄'}</span>`;
    html += `<span class="tree-name">${name}</span>`;
    html += `<span class="tree-status">${statusIcon}</span>`;
    html += `</div>`;
    
    if (isDirectory && Object.keys(node.children).length > 0) {
        html += `<div class="tree-children" style="display: none;">`;
        Object.entries(node.children)
            .sort(([a, nodeA], [b, nodeB]) => {
                // Directories first, then files
                if (nodeA.type !== nodeB.type) {
                    return nodeA.type === 'directory' ? -1 : 1;
                }
                return a.localeCompare(b);
            })
            .forEach(([childName, childNode]) => {
                html += renderTreeNode(childName, childNode, depth + 1);
            });
        html += `</div>`;
    }
    
    html += `</div>`;
    return html;
}

function getStatusIcon(status) {
    switch (status) {
        case 'A': return '🟢';
        case 'M': return '🟡';
        case 'D': return '🔴';
        default: return '⚪';
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'A': return 'status-added';
        case 'M': return 'status-modified';
        case 'D': return 'status-deleted';
        default: return 'status-unchanged';
    }
}

function getFileContent(filePath, ref) {
    try {
        // For HEAD, use filesystem to properly handle symlinks
        if (ref === 'HEAD') {
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, 'utf8');
            } else {
                return null;
            }
        }
        
        // For other refs, use git show (upstream may not have symlinks)
        const output = execSync(`git show ${ref}:"${filePath}"`, { encoding: 'utf8' });
        return output;
    } catch (error) {
        // File doesn't exist in this ref or other error
        return null;
    }
}

function fetchFileContents(changes) {
    console.log('📄 Fetching file contents for diffs...');
    const fileContents = {};
    
    Object.entries(changes).forEach(([filePath, status]) => {
        if (status === 'A' || status === 'M') {
            const upstreamContent = getFileContent(filePath, 'upstream/main');
            const forkContent = getFileContent(filePath, 'HEAD');
            
            if (forkContent !== null) {
                fileContents[filePath] = {
                    upstream: upstreamContent || '// This file does not exist in upstream',
                    fork: forkContent
                };
            }
        }
    });
    
    return fileContents;
}

function generateHtmlReport(upstreamFiles, forkFiles, changes) {
    console.log('🎨 Generating fork comparison report...');
    
    // Fetch file contents for diffs
    const fileContents = fetchFileContents(changes);
    
    // Build trees
    const upstreamTree = buildFileTree(upstreamFiles, {});
    const forkTree = buildFileTree(forkFiles, changes);
    
    // Get statistics
    const upstreamStats = getTreeStats(upstreamTree);
    const forkStats = getTreeStats(forkTree);
    const changeStats = {
        added: Object.values(changes).filter(s => s === 'A').length,
        modified: Object.values(changes).filter(s => s === 'M').length,
        deleted: Object.values(changes).filter(s => s === 'D').length
    };
    
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fork vs Upstream Comparison - CCPM</title>
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
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .stat-card {
            background: #f1f8ff;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #0366d6;
        }
        .stat-title {
            font-size: 14px;
            font-weight: 600;
            color: #24292e;
            margin-bottom: 10px;
        }
        .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: #0366d6;
        }
        .stat-label {
            font-size: 12px;
            color: #586069;
            text-transform: uppercase;
        }
        .legend {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .legend h3 {
            margin: 0 0 10px 0;
            color: #24292e;
        }
        .legend-items {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .legend-icon {
            font-size: 16px;
        }
        .comparison-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        .tree-section {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .tree-header {
            background: #f6f8fa;
            padding: 15px;
            border-bottom: 1px solid #d8dee4;
            font-weight: 600;
            color: #24292e;
        }
        .tree-content {
            padding: 15px;
            max-height: 600px;
            overflow-y: auto;
            font-family: 'SFMono-Regular', Consolas, monospace;
            font-size: 13px;
        }
        .tree-node {
            margin: 2px 0;
        }
        .tree-item {
            display: flex;
            align-items: center;
            padding: 2px 0;
            cursor: pointer;
            border-radius: 3px;
        }
        .tree-item:hover {
            background-color: #f6f8fa;
        }
        .tree-toggle {
            width: 16px;
            cursor: pointer;
            user-select: none;
            color: #586069;
            font-size: 12px;
        }
        .tree-spacer {
            width: 16px;
        }
        .tree-icon {
            margin: 0 6px;
        }
        .tree-name {
            flex: 1;
            color: #24292e;
        }
        .tree-status {
            margin-left: 8px;
            font-size: 12px;
        }
        .tree-children {
            margin-left: 0;
        }
        .status-added .tree-name { color: #28a745; }
        .status-modified .tree-name { color: #ffa500; }
        .status-deleted .tree-name { color: #d73a49; }
        .status-unchanged .tree-name { color: #586069; }
        .controls {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            text-align: center;
        }
        .btn {
            background: #0366d6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin: 0 5px;
            font-size: 14px;
        }
        .btn:hover {
            background: #0256cc;
        }
        .powered-by {
            text-align: center;
            margin-top: 20px;
            color: #586069;
            font-size: 12px;
        }
        @media (max-width: 768px) {
            .comparison-container {
                grid-template-columns: 1fr;
            }
        }
        
        /* Modal Styles for Diff Display */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .modal.show {
            opacity: 1;
            visibility: visible;
        }
        .modal-content {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            width: 95vw;
            height: 90vh;
            max-width: 1400px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #e1e4e8;
            background: #f6f8fa;
        }
        .modal-header h3 {
            margin: 0;
            color: #24292e;
            font-size: 16px;
        }
        .modal-close {
            cursor: pointer;
            font-size: 24px;
            color: #586069;
            font-weight: bold;
            line-height: 1;
        }
        .modal-close:hover {
            color: #24292e;
        }
        #diffContainer {
            padding: 20px;
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        /* Click indicators for changed files */
        .tree-node[data-type="file"][data-status="A"] .tree-name,
        .tree-node[data-type="file"][data-status="M"] .tree-name {
            cursor: pointer;
            position: relative;
        }
        .tree-node[data-type="file"][data-status="A"]:hover .tree-name,
        .tree-node[data-type="file"][data-status="M"]:hover .tree-name {
            text-decoration: underline;
            font-weight: 500;
        }
        
        /* Visual feedback for clickable changed files */
        .tree-node[data-type="file"][data-status="A"] .tree-name::after,
        .tree-node[data-type="file"][data-status="M"] .tree-name::after {
            content: " 🔍";
            opacity: 0.6;
            font-size: 10px;
            margin-left: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔄 Fork vs Upstream Comparison</h1>
        <p><strong>Fork:</strong> <code>smian0/ccpm</code> vs <strong>Upstream:</strong> <code>automazeio/ccpm</code></p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-title">Fork Repository</div>
                <div class="stat-number">${forkStats.files}</div>
                <div class="stat-label">Files</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Upstream Repository</div>
                <div class="stat-number">${upstreamStats.files}</div>
                <div class="stat-label">Files</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Added Files</div>
                <div class="stat-number">${changeStats.added}</div>
                <div class="stat-label">🟢 New in Fork</div>
            </div>
            <div class="stat-card">
                <div class="stat-title">Modified Files</div>
                <div class="stat-number">${changeStats.modified}</div>
                <div class="stat-label">🟡 Changed</div>
            </div>
        </div>
    </div>
    
    <div class="legend">
        <h3>📋 Status Legend</h3>
        <div class="legend-items">
            <div class="legend-item">
                <span class="legend-icon">🟢</span>
                <span>Added (only in fork)</span>
            </div>
            <div class="legend-item">
                <span class="legend-icon">🟡</span>
                <span>Modified (different content)</span>
            </div>
            <div class="legend-item">
                <span class="legend-icon">🔴</span>
                <span>Deleted (only in upstream)</span>
            </div>
            <div class="legend-item">
                <span class="legend-icon">⚪</span>
                <span>Unchanged (identical)</span>
            </div>
        </div>
    </div>
    
    <div class="controls">
        <button class="btn" onclick="expandAll()">Expand All</button>
        <button class="btn" onclick="collapseAll()">Collapse All</button>
        <button class="btn" onclick="showChangedOnly()">${changeStats.added + changeStats.modified > 0 ? 'Show Changed Only' : 'All Files Unchanged'}</button>
    </div>
    
    <div class="comparison-container">
        <div class="tree-section">
            <div class="tree-header">
                📁 Fork Repository (${forkStats.files} files)
            </div>
            <div class="tree-content" id="forkTree">
                ${Object.entries(forkTree)
                    .sort(([a, nodeA], [b, nodeB]) => {
                        if (nodeA.type !== nodeB.type) {
                            return nodeA.type === 'directory' ? -1 : 1;
                        }
                        return a.localeCompare(b);
                    })
                    .map(([name, node]) => renderTreeNode(name, node))
                    .join('')}
            </div>
        </div>
        
        <div class="tree-section">
            <div class="tree-header">
                📁 Upstream Repository (${upstreamStats.files} files)
            </div>
            <div class="tree-content" id="upstreamTree">
                ${Object.entries(upstreamTree)
                    .sort(([a, nodeA], [b, nodeB]) => {
                        if (nodeA.type !== nodeB.type) {
                            return nodeA.type === 'directory' ? -1 : 1;
                        }
                        return a.localeCompare(b);
                    })
                    .map(([name, node]) => renderTreeNode(name, node))
                    .join('')}
            </div>
        </div>
    </div>
    
    <div class="powered-by">
        CCPM Fork Comparison Tool - Interactive repository tree diff viewer
    </div>

    <!-- Diff Modal -->
    <div id="diffModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">File Diff</h3>
                <span class="modal-close" onclick="closeDiff()">×</span>
            </div>
            <div id="diffContainer"></div>
        </div>
    </div>

    <!-- Monaco Editor -->
    <script src="https://unpkg.com/monaco-editor@latest/min/vs/loader.js"></script>
    <script>
        // File contents for diff display - embedded using base64 encoding to avoid escaping issues
        window.fileContents = {};
        ${Object.entries(fileContents).map(([filePath, content]) => {
            const upstreamB64 = Buffer.from(content.upstream || '').toString('base64');
            const forkB64 = Buffer.from(content.fork || '').toString('base64');
            return `window.fileContents[${JSON.stringify(filePath)}] = {
            upstream: atob(${JSON.stringify(upstreamB64)}),
            fork: atob(${JSON.stringify(forkB64)})
        };`;
        }).join('\n        ')}
    </script>
    <script>
        // Tree expansion/collapse functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tree-toggle')) {
                const children = e.target.parentNode.parentNode.querySelector('.tree-children');
                if (children) {
                    const isExpanded = children.style.display !== 'none';
                    children.style.display = isExpanded ? 'none' : 'block';
                    e.target.textContent = isExpanded ? '▶' : '▼';
                }
            }
        });
        
        // Enhanced click handling for both tree navigation and diff display
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tree-name')) {
                const treeNode = e.target.closest('.tree-node');
                const fileType = treeNode?.dataset.type;
                const fileStatus = treeNode?.dataset.status;
                const filePath = treeNode?.dataset.path;
                
                if (fileType === 'directory') {
                    // Handle folder expansion/collapse
                    const children = treeNode.querySelector('.tree-children');
                    if (children) {
                        const isExpanded = children.style.display !== 'none';
                        children.style.display = isExpanded ? 'none' : 'block';
                        
                        // Update the toggle icon if it exists
                        const toggle = treeNode.querySelector('.tree-toggle');
                        if (toggle) {
                            toggle.textContent = isExpanded ? '▶' : '▼';
                        }
                    }
                } else if (fileType === 'file' && (fileStatus === 'A' || fileStatus === 'M') && filePath) {
                    // Handle file clicks for diff display (only for changed files)
                    e.stopPropagation();
                    showDiff(filePath, fileStatus);
                }
            }
        });
        
        // Diff modal functions
        async function showDiff(filePath, fileStatus) {
            const modal = document.getElementById('diffModal');
            const modalTitle = document.getElementById('modalTitle');
            const diffContainer = document.getElementById('diffContainer');
            
            try {
                modalTitle.innerHTML = '<span class="status-' + fileStatus.toLowerCase() + '">' + (fileStatus === 'A' ? '🟢 Added' : '🟡 Modified') + '</span>: ' + filePath;
                diffContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Loading diff...</div>';
                
                // Show modal with smooth transition
                modal.style.display = 'flex';
                setTimeout(() => modal.classList.add('show'), 10);
                
                // Create Monaco Editor for diff display - use full available space
                diffContainer.innerHTML = '<div id="diffEditor" style="flex: 1; min-height: 600px; border: 1px solid #d8dee4;"></div>';
                
                require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });
                require(['vs/editor/editor.main'], function () {
                    const diffEditor = monaco.editor.createDiffEditor(document.getElementById('diffEditor'), {
                        originalEditable: false,
                        readOnly: true,
                        renderSideBySide: true,
                        automaticLayout: true,
                        theme: 'vs',
                        fontSize: 13
                    });
                    
                    let originalContent = '';
                    let modifiedContent = '';
                    
                    // Get actual file content from embedded data
                    const fileData = window.fileContents && window.fileContents[filePath];
                    
                    if (fileStatus === 'A') {
                        originalContent = '// This file does not exist in upstream';
                        modifiedContent = fileData ? fileData.fork : 'File content not available';
                    } else {
                        originalContent = fileData ? fileData.upstream : 'Upstream content not available';
                        modifiedContent = fileData ? fileData.fork : 'Fork content not available';
                    }
                    
                    // Detect file type for syntax highlighting
                    const extension = filePath.split('.').pop().toLowerCase();
                    let language = 'plaintext';
                    
                    const languageMap = {
                        'js': 'javascript',
                        'ts': 'typescript', 
                        'json': 'json',
                        'md': 'markdown',
                        'html': 'html',
                        'css': 'css',
                        'py': 'python',
                        'sh': 'shell',
                        'yml': 'yaml',
                        'yaml': 'yaml',
                        'xml': 'xml',
                        'sql': 'sql',
                        'php': 'php',
                        'rb': 'ruby',
                        'go': 'go',
                        'java': 'java',
                        'c': 'c',
                        'cpp': 'cpp',
                        'cs': 'csharp'
                    };
                    
                    if (languageMap[extension]) {
                        language = languageMap[extension];
                    }
                    
                    const originalModel = monaco.editor.createModel(originalContent, language);
                    const modifiedModel = monaco.editor.createModel(modifiedContent, language);
                    
                    diffEditor.setModel({
                        original: originalModel,
                        modified: modifiedModel
                    });
                });
                
            } catch (error) {
                console.error('Error loading diff:', error);
                diffContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #dc3545;">Error loading diff. Please try again.</div>';
            }
        }
        
        function closeDiff() {
            const modal = document.getElementById('diffModal');
            
            // Smooth fade out
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                
                // Clean up Monaco editor
                const diffEditor = document.getElementById('diffEditor');
                if (diffEditor) {
                    diffEditor.innerHTML = '';
                }
            }, 300); // Match transition duration
        }
        
        // Close modal when clicking outside or on close button
        document.getElementById('diffModal').addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('modal-close')) {
                closeDiff();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeDiff();
            }
        });
        
        function expandAll() {
            document.querySelectorAll('.tree-children').forEach(children => {
                children.style.display = 'block';
            });
            document.querySelectorAll('.tree-toggle').forEach(toggle => {
                toggle.textContent = '▼';
            });
        }
        
        function collapseAll() {
            document.querySelectorAll('.tree-children').forEach(children => {
                children.style.display = 'none';
            });
            document.querySelectorAll('.tree-toggle').forEach(toggle => {
                toggle.textContent = '▶';
            });
        }
        
        function showChangedOnly() {
            const isFiltered = document.body.classList.contains('show-changed-only');
            
            if (isFiltered) {
                // Show all nodes
                document.querySelectorAll('.tree-node').forEach(node => {
                    node.style.display = 'block';
                });
                document.body.classList.remove('show-changed-only');
                event.target.textContent = 'Show Changed Only';
            } else {
                // Hide unchanged nodes
                document.querySelectorAll('.tree-node').forEach(node => {
                    if (node.classList.contains('status-unchanged')) {
                        node.style.display = 'none';
                    }
                });
                document.body.classList.add('show-changed-only');
                event.target.textContent = 'Show All Files';
            }
        }
        
        // Synchronized scrolling (optional)
        const forkTree = document.getElementById('forkTree');
        const upstreamTree = document.getElementById('upstreamTree');
        let isScrolling = false;
        
        forkTree.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                upstreamTree.scrollTop = this.scrollTop;
                setTimeout(() => isScrolling = false, 100);
            }
        });
        
        upstreamTree.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                forkTree.scrollTop = this.scrollTop;
                setTimeout(() => isScrolling = false, 100);
            }
        });
    </script>
</body>
</html>`;
    
    return htmlTemplate;
}

function main() {
    console.log('🚀 Starting CCPM Fork Comparison Generator');
    
    try {
        // Fetch latest upstream
        fetchUpstream();
        
        // Get file lists
        console.log('📁 Analyzing file trees...');
        const upstreamFiles = getFileList('upstream/main');
        const forkFiles = getFileList('HEAD');
        
        // Get changes
        console.log('🔍 Identifying changes...');
        const changes = getFileChanges();
        
        console.log(`📊 Found ${upstreamFiles.size} upstream files, ${forkFiles.size} fork files`);
        console.log(`📝 Changes: ${Object.keys(changes).length} files modified`);
        
        // Generate HTML report
        const htmlReport = generateHtmlReport(upstreamFiles, forkFiles, changes);
        
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
        
    } catch (error) {
        console.error('❌ Error generating fork comparison:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { getFileList, getFileChanges, buildFileTree, generateHtmlReport };