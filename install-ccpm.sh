#!/bin/bash

# CCPM Local Installer - Dual CLI Support
# Installs both Claude Code and OpenCode configurations
# Usage: ./install-ccpm.sh [target-directory]

CCPM_SOURCE="/Users/smian/github-smian0/ccpm"
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

# Copy Claude Code configuration (README only)
echo "📁 Copying Claude Code configuration (.claude)..."
mkdir -p "$TARGET_DIR/.claude"
find "$CCPM_SOURCE/.claude" -name "README*" -type f -exec cp {} "$TARGET_DIR/.claude/" \; 2>/dev/null || echo "⚠️  No README files found in .claude, skipping"

# Copy OpenCode configuration (README only)
echo "📁 Copying OpenCode configuration (.opencode)..."
mkdir -p "$TARGET_DIR/.opencode"
find "$CCPM_SOURCE/.opencode" -name "README*" -type f -exec cp {} "$TARGET_DIR/.opencode/" \; 2>/dev/null || echo "⚠️  No README files found in .opencode, skipping"

# Copy documentation files
echo "📄 Copying documentation..."
cp "$CCPM_SOURCE/AGENTS.md" "$TARGET_DIR/" 2>/dev/null || echo "⚠️  AGENTS.md not found, skipping"
cp "$CCPM_SOURCE/COMMANDS.md" "$TARGET_DIR/" 2>/dev/null || echo "⚠️  COMMANDS.md not found, skipping"

# Skip CLAUDE.md symlink and PM system initialization
# (Only copying README files, not full directory structures)
echo "⚠️  Skipping CLAUDE.md symlink and PM system initialization (README-only installation)"

# Apply overrides if available
echo "🔧 Applying overrides..."
cd "$TARGET_DIR"
bash "$CCPM_SOURCE/apply-overrides.sh"

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
echo "📖 Documentation installed:"
echo "   .claude/README*   (Claude Code documentation)"
echo "   .opencode/README* (OpenCode documentation)"
echo ""
echo "⚠️  Note: Only README files installed - full configuration not copied"
echo "    For full setup, copy configuration files manually from:"
echo "    Source: $CCPM_SOURCE"