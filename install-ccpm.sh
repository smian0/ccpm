#!/bin/bash

# CCPM Local Installer - Claude Code Support
# Installs Claude Code configuration for project management
# Usage: ./install-ccpm.sh [target-directory]

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CCPM_SOURCE="${CCPM_SOURCE:-$SCRIPT_DIR}"  # Allow override via env var, default to script location
TARGET_DIR="${1:-.}"

if [ ! -d "$CCPM_SOURCE" ]; then
    echo "❌ Error: CCPM source directory not found at $CCPM_SOURCE"
    exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Error: Target directory $TARGET_DIR does not exist"
    exit 1
fi

echo "🚀 Installing CCPM to $TARGET_DIR"
echo "📂 Source: $CCPM_SOURCE"
echo ""

# Backup existing configuration if it exists
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_MADE=false

if [ -d "$TARGET_DIR/.claude" ]; then
    echo "📦 Backing up existing .claude directory..."
    BACKUP_DIR="$TARGET_DIR/.claude.backup.$TIMESTAMP"
    cp -r "$TARGET_DIR/.claude" "$BACKUP_DIR"
    echo "✅ Backed up to: $BACKUP_DIR"
    BACKUP_MADE=true
fi

if [ "$BACKUP_MADE" = true ]; then
    echo "💾 Backup created with timestamp: $TIMESTAMP"
    echo ""
fi

# Check CLI availability
echo "🔍 Checking CLI availability..."

if command -v claude >/dev/null 2>&1; then
    echo "✅ Claude Code CLI detected"
else
    echo "⚠️  Claude Code CLI not found - install from https://claude.ai/download"
fi

echo ""

# Copy Claude Code configuration
echo "📁 Copying Claude Code configuration (.claude)..."
if [ -d "$CCPM_SOURCE/.claude" ]; then
    cp -r "$CCPM_SOURCE/.claude" "$TARGET_DIR/"
    echo "✅ Claude Code configuration copied"
else
    echo "❌ Error: Claude Code configuration not found at $CCPM_SOURCE/.claude"
    exit 1
fi

# Apply extensions/overrides
echo "🤖 Applying configuration overrides..."
if [ -d "$CCPM_SOURCE/.claude-ext" ]; then
    mkdir -p "$TARGET_DIR/.claude"
    cp -r "$CCPM_SOURCE/.claude-ext/"* "$TARGET_DIR/.claude/"
    echo "✅ Configuration overrides applied"
else
    echo "ℹ️  No configuration overrides found"
fi

# Copy documentation files
echo "📄 Copying documentation..."
cp "$CCPM_SOURCE/AGENTS.md" "$TARGET_DIR/" 2>/dev/null || echo "⚠️  AGENTS.md not found, skipping"
cp "$CCPM_SOURCE/COMMANDS.md" "$TARGET_DIR/" 2>/dev/null || echo "⚠️  COMMANDS.md not found, skipping"

echo ""
echo "✅ CCPM installation complete!"
echo ""

echo "🎯 Getting Started:"
echo "  1. Create your first PRD:"
echo "     claude /pm:prd-new <feature-name>"
echo ""
echo "  2. View available commands:"
echo "     claude /pm:help"
echo ""
echo "  3. Check project status:"
echo "     claude /pm:status"
echo ""

echo "📖 Configuration installed:"
echo "   .claude/       (CCPM configuration with custom agents)"
echo ""

if [ "$BACKUP_MADE" = true ]; then
    echo "💡 Restore backup if needed:"
    echo "   mv $TARGET_DIR/.claude.backup.$TIMESTAMP $TARGET_DIR/.claude"
    echo ""
fi

echo "✅ CCPM setup complete - ready to use!"