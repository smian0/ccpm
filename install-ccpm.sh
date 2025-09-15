#!/bin/bash

# CCPM Local Installer
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

echo "🚀 Installing CCPM to $TARGET_DIR"
echo "📂 Source: $CCPM_SOURCE"

# Copy .claude directory
echo "📁 Copying .claude directory..."
cp -r "$CCPM_SOURCE/.claude" "$TARGET_DIR/"

# Copy documentation files
echo "📄 Copying documentation..."
cp "$CCPM_SOURCE/AGENTS.md" "$TARGET_DIR/" 2>/dev/null || echo "⚠️  AGENTS.md not found, skipping"
cp "$CCPM_SOURCE/COMMANDS.md" "$TARGET_DIR/" 2>/dev/null || echo "⚠️  COMMANDS.md not found, skipping"

# Initialize PM system
echo "⚙️  Initializing PM system..."
cd "$TARGET_DIR"
bash .claude/scripts/pm/init.sh

echo "✅ CCPM installation complete!"
echo ""
echo "🎯 Next Steps:"
echo "  1. Create your first PRD: /pm:prd-new <feature-name>"
echo "  2. View help: /pm:help"
echo "  3. Check status: /pm:status"