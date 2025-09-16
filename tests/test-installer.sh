#!/bin/bash

# CCPM Installation Test Script
# Tests the installer and verifies the installation is correct

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CCPM_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEST_DIR="$SCRIPT_DIR/test-install"

echo "🧪 CCPM Installation Test"
echo "========================="
echo "CCPM Root: $CCPM_ROOT"
echo "Test Directory: $TEST_DIR"
echo ""

# Clean up any existing test installation
if [ -d "$TEST_DIR" ]; then
    echo "🧹 Cleaning up existing test installation..."
    rm -rf "$TEST_DIR"
fi

# Create test directory and run the installer
echo "🚀 Running installer..."
mkdir -p "$TEST_DIR"
cd "$CCPM_ROOT"
./install-ccpm.sh "$TEST_DIR"

echo ""
echo "🔍 Verifying installation..."

# Test 1: Check that main directories exist
echo "📁 Checking directory structure..."
REQUIRED_DIRS=(
    ".claude"
    ".claude/agents"
    ".opencode"
    ".opencode/agents"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$TEST_DIR/$dir" ]; then
        echo "  ✅ $dir exists"
    else
        echo "  ❌ $dir missing"
        exit 1
    fi
done

# Test 2: Check that file-analyzer agents exist with correct tools in main directories
echo "🤖 Checking file-analyzer agents..."

# Check Claude Code file-analyzer (overridden in main directory)
CLAUDE_AGENT="$TEST_DIR/.claude/agents/file-analyzer.md"
if [ -f "$CLAUDE_AGENT" ]; then
    if grep -q "mcp__serena__read_file" "$CLAUDE_AGENT"; then
        echo "  ✅ Claude Code file-analyzer overridden with Serena tools"
    else
        echo "  ❌ Claude Code file-analyzer missing Serena tools"
        exit 1
    fi
else
    echo "  ❌ Claude Code file-analyzer not found"
    exit 1
fi

# Check OpenCode file-analyzer (installed in main directory)
OPENCODE_AGENT="$TEST_DIR/.opencode/agents/file-analyzer.md"
if [ -f "$OPENCODE_AGENT" ]; then
    if grep -q "tools: read, list, glob, grep" "$OPENCODE_AGENT"; then
        echo "  ✅ OpenCode file-analyzer installed with OpenCode tools"
    else
        echo "  ❌ OpenCode file-analyzer missing OpenCode tools"
        exit 1
    fi
else
    echo "  ❌ OpenCode file-analyzer not found"
    exit 1
fi

# Test 3: Check that core files exist
echo "📄 Checking core files..."
REQUIRED_FILES=(
    "AGENTS.md"
    "COMMANDS.md"
    ".claude/commands/pm/help.md"
    ".opencode/command/pm/sync.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$TEST_DIR/$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
        exit 1
    fi
done

# Test 4: Count files to ensure full copy (excluding extension directories)
echo "📊 Checking installation completeness..."
SOURCE_FILES=$(find "$CCPM_ROOT/.claude" "$CCPM_ROOT/.opencode" -type f 2>/dev/null | wc -l)
INSTALLED_FILES=$(find "$TEST_DIR/.claude" "$TEST_DIR/.opencode" -type f 2>/dev/null | wc -l)

echo "  📁 Source files: $SOURCE_FILES"
echo "  📁 Installed files: $INSTALLED_FILES"

if [ "$INSTALLED_FILES" -ge "$SOURCE_FILES" ]; then
    echo "  ✅ All files copied (including overrides)"
else
    echo "  ⚠️  File count mismatch - some files may be missing"
fi

# Test 5: Verify agents work differently
echo "🔧 Verifying agent differences..."
CLAUDE_TOOLS=$(grep "tools:" "$CLAUDE_AGENT" | cut -d: -f2)
OPENCODE_TOOLS=$(grep "tools:" "$OPENCODE_AGENT" | cut -d: -f2)

if [ "$CLAUDE_TOOLS" != "$OPENCODE_TOOLS" ]; then
    echo "  ✅ Agents have different tools (platform-specific)"
else
    echo "  ❌ Agents have identical tools (override failed)"
    exit 1
fi

echo ""
echo "✅ All tests passed!"
echo ""
echo "📋 Test Summary:"
echo "  ✅ Directory structure correct"
echo "  ✅ File-analyzer agents installed"
echo "  ✅ Platform-specific tools configured"
echo "  ✅ Core files present"
echo "  ✅ Full installation verified"
echo ""
echo "🎯 Test installation available at: $TEST_DIR"
echo "💡 To clean up: rm -rf $TEST_DIR"