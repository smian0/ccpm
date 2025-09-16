#!/bin/bash

# CCPM Local Installer - Dual CLI Support
# Installs both Claude Code and OpenCode configurations
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

echo "🚀 Installing CCPM Dual CLI to $TARGET_DIR"
echo "📂 Source: $CCPM_SOURCE"
echo ""

# Backup existing configurations if they exist
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_MADE=false

if [ -d "$TARGET_DIR/.claude" ]; then
    echo "📦 Backing up existing .claude directory..."
    BACKUP_DIR="$TARGET_DIR/.claude.backup.$TIMESTAMP"
    cp -r "$TARGET_DIR/.claude" "$BACKUP_DIR"
    echo "✅ Backed up to: $BACKUP_DIR"
    BACKUP_MADE=true
fi

if [ -d "$TARGET_DIR/.opencode" ]; then
    echo "📦 Backing up existing .opencode directory..."
    BACKUP_DIR="$TARGET_DIR/.opencode.backup.$TIMESTAMP"
    cp -r "$TARGET_DIR/.opencode" "$BACKUP_DIR"
    echo "✅ Backed up to: $BACKUP_DIR"
    BACKUP_MADE=true
fi

if [ "$BACKUP_MADE" = true ]; then
    echo "💾 Backups created with timestamp: $TIMESTAMP"
    echo ""
fi

# Check CLI availability
echo "🔍 Checking CLI availability..."
CLAUDE_AVAILABLE=false
OPENCODE_AVAILABLE=false

if command -v claude >/dev/null 2>&1; then
    CLAUDE_AVAILABLE=true
    echo "✅ Claude Code CLI detected"
else
    echo "⚠️  Claude Code CLI not found"
fi

if command -v opencode >/dev/null 2>&1; then
    OPENCODE_AVAILABLE=true
    echo "✅ OpenCode CLI detected"
else
    echo "⚠️  OpenCode CLI not found"
fi

echo ""

# Copy full Claude Code configuration
echo "📁 Copying Claude Code configuration (.claude)..."
if [ -d "$CCPM_SOURCE/.claude" ]; then
    cp -r "$CCPM_SOURCE/.claude" "$TARGET_DIR/"
    echo "✅ Claude Code configuration copied"
else
    echo "⚠️  Claude Code configuration not found, skipping"
fi

# Copy full OpenCode configuration  
echo "📁 Copying OpenCode configuration (.opencode)..."
if [ -d "$CCPM_SOURCE/.opencode" ]; then
    cp -r "$CCPM_SOURCE/.opencode" "$TARGET_DIR/"
    echo "✅ OpenCode configuration copied"
else
    echo "⚠️  OpenCode configuration not found, skipping"
fi

# Override extensions - copy all files from ext directories
echo "🤖 Installing agent overrides..."

# Override Claude Code extensions
if [ -d "$CCPM_SOURCE/.claude-ext" ]; then
    mkdir -p "$TARGET_DIR/.claude"
    cp -r "$CCPM_SOURCE/.claude-ext/"* "$TARGET_DIR/.claude/"
    echo "✅ Claude Code extensions overridden"
else
    echo "⚠️  Claude Code extensions not found, skipping"
fi

# Override OpenCode extensions  
if [ -d "$CCPM_SOURCE/.opencode-ext" ]; then
    mkdir -p "$TARGET_DIR/.opencode"
    cp -r "$CCPM_SOURCE/.opencode-ext/"* "$TARGET_DIR/.opencode/"
    echo "✅ OpenCode extensions overridden"
else
    echo "⚠️  OpenCode extensions not found, skipping"
fi

# Copy documentation files
echo "📄 Copying documentation..."
cp "$CCPM_SOURCE/AGENTS.md" "$TARGET_DIR/" 2>/dev/null || echo "⚠️  AGENTS.md not found, skipping"
cp "$CCPM_SOURCE/COMMANDS.md" "$TARGET_DIR/" 2>/dev/null || echo "⚠️  COMMANDS.md not found, skipping"

# Skip CLAUDE.md symlink and PM system initialization
# (Full configuration copied, ready to use)
echo "✅ Full configuration installed - ready to use"

# Extensions already applied above via generic copying

echo ""
echo "✅ CCPM Dual CLI installation complete!"
echo ""

# CLI-specific instructions
echo "🎯 Available CLIs:"
if [ "$CLAUDE_AVAILABLE" = true ]; then
    echo "  📘 Claude Code: claude /pm:help"
fi
if [ "$OPENCODE_AVAILABLE" = true ]; then
    echo "  📗 OpenCode:    opencode run \"/pm:help\""
fi

echo ""
echo "🎯 Next Steps:"
echo "  1. Create your first PRD:"
if [ "$CLAUDE_AVAILABLE" = true ]; then
    echo "     Claude:   claude /pm:prd-new <feature-name>"
fi
if [ "$OPENCODE_AVAILABLE" = true ]; then
    echo "     OpenCode: opencode run \"/pm:prd-new <feature-name>\""
fi
echo ""
echo "  2. View help:"
if [ "$CLAUDE_AVAILABLE" = true ]; then
    echo "     Claude:   claude /pm:help"
fi
if [ "$OPENCODE_AVAILABLE" = true ]; then
    echo "     OpenCode: opencode run \"/pm:help\""
fi
echo ""
echo "  3. Check status:"
if [ "$CLAUDE_AVAILABLE" = true ]; then
    echo "     Claude:   claude /pm:status"
fi
if [ "$OPENCODE_AVAILABLE" = true ]; then
    echo "     OpenCode: opencode run \"/pm:status\""
fi

echo ""
echo "📖 Full configuration installed:"
echo "   .claude/       (Claude Code configuration with file-analyzer override)"
echo "   .opencode/     (OpenCode configuration with file-analyzer agent)" 
echo ""

if [ "$BACKUP_MADE" = true ]; then
    echo "💡 Restore backups if needed:"
    echo "   mv $TARGET_DIR/.claude.backup.$TIMESTAMP $TARGET_DIR/.claude"
    echo "   mv $TARGET_DIR/.opencode.backup.$TIMESTAMP $TARGET_DIR/.opencode"
    echo ""
fi

echo "✅ Complete setup - all files copied and agents overridden"