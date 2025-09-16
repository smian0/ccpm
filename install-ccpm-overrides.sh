#!/bin/bash
# install-ccpm-overrides.sh - Apply .claude-ext overrides to .claude

[ -d ".claude-ext" ] && cp -r .claude-ext/* .claude/ && echo "✓ Overrides applied" || echo "No overrides found"