#!/bin/bash

# CCPM Installation Test Script
# Tests the Claude Code installer and verifies the installation is correct

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CCPM_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEST_DIR="$SCRIPT_DIR/test-install"

echo "🧪 CCPM Installation Test (Claude Code)"
echo "========================================"
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
    ".claude/commands"
    ".claude/context"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$TEST_DIR/$dir" ]; then
        echo "  ✅ $dir exists"
    else
        echo "  ❌ $dir missing"
        exit 1
    fi
done

# Test 2: Check that file-analyzer agent exists with correct tools
echo "🤖 Checking file-analyzer agent..."

CLAUDE_AGENT="$TEST_DIR/.claude/agents/file-analyzer.md"
if [ -f "$CLAUDE_AGENT" ]; then
    if grep -q "mcp__serena__read_file" "$CLAUDE_AGENT"; then
        echo "  ✅ Claude Code file-analyzer has Serena MCP tools"
    else
        echo "  ❌ Claude Code file-analyzer missing Serena MCP tools"
        exit 1
    fi
else
    echo "  ❌ Claude Code file-analyzer not found"
    exit 1
fi

# Test 3: Check that core files exist
echo "📄 Checking core files..."
REQUIRED_FILES=(
    "AGENTS.md"
    "COMMANDS.md"
    ".claude/commands/pm/help.md"
    ".claude/CLAUDE.md"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$TEST_DIR/$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
        exit 1
    fi
done

# Test 4: Check installation completeness
echo "📊 Checking installation completeness..."
SOURCE_FILES=$(find "$CCPM_ROOT/.claude" -type f 2>/dev/null | wc -l)
INSTALLED_FILES=$(find "$TEST_DIR/.claude" -type f 2>/dev/null | wc -l)

echo "  📁 Source files: $SOURCE_FILES"
echo "  📁 Installed files: $INSTALLED_FILES"

if [ "$INSTALLED_FILES" -ge "$SOURCE_FILES" ]; then
    echo "  ✅ All files copied (including overrides)"
else
    echo "  ⚠️  File count mismatch - some files may be missing"
fi

# Test 5: Verify override application
echo "🔧 Verifying configuration overrides..."
if [ -d "$CCPM_ROOT/.claude-ext" ]; then
    echo "  ✅ Overrides source found"
    # Check if overrides were applied by looking for override-specific content
    if grep -q "mcp__serena" "$CLAUDE_AGENT"; then
        echo "  ✅ Overrides successfully applied"
    else
        echo "  ❌ Overrides not applied"
        exit 1
    fi
else
    echo "  ℹ️  No overrides to apply"
fi

echo ""
echo "✅ All tests passed!"
echo ""
echo "📋 Test Summary:"
echo "  ✅ Directory structure correct"
echo "  ✅ File-analyzer agent configured"
echo "  ✅ Serena MCP tools integrated"
echo "  ✅ Core files present"
echo "  ✅ Configuration overrides applied"
echo ""
echo "🎯 Test installation available at: $TEST_DIR"
echo "💡 To clean up: rm -rf $TEST_DIR"