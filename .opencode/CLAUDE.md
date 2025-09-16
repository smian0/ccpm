# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## OpenCode Integration

For complete OpenCode configuration documentation, see: @OPENCODE.md

This includes model configuration, agent schemas, MCP integration, and generic OpenCode setup.

## CCPM Command Reference

### PM Commands (`/pm:*`)
Project management workflow commands for GitHub Issues and Epic management:
- `/pm:init` - Initialize PM system with directory structure
- `/pm:status` - Show current project status and active work
- `/pm:help` - Display all available PM commands
- `/pm:epic-*` - Epic management (start, sync, close, decompose, etc.)
- `/pm:issue-*` - GitHub Issue workflow (analyze, start, sync, close, etc.)
- `/pm:prd-*` - Product Requirements Document management

### Context Commands (`/context:*`)

Project documentation and knowledge management system. See `context/README.md` for details.

- `/context:create` - Generate initial project context documentation
- `/context:prime` - Load context information for new agent sessions  
- `/context:update` - Update context documentation to reflect current state

### Testing Commands (`/testing:*`)
- `/testing:prime` - Configure testing framework and patterns
- `/testing:run` - Execute tests with automated analysis and reporting

## CCPM Workflow Integration

This repository integrates Claude Code Project Management (CCPM) with OpenCode for:
- GitHub Issues and Epic tracking
- Git worktree-based parallel development
- Automated project documentation
- Context-aware AI agent coordination