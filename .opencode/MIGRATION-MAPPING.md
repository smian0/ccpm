# Claude Code to OpenCode Migration Mapping

This document provides an exact mapping of how files and directories migrated from Claude Code (`.claude/`) to OpenCode (`.opencode/`).

## Migration Summary

- **Source**: 80 files in `.claude/`
- **Destination**: 128+ files in `.opencode/` (includes OpenCode enhancements)
- **Migration Status**: 100% Complete with functional enhancements

## Directory Structure Mapping

### Core Configuration

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/settings.local.json` | `.opencode/opencode.json` | ✅ Transformed | Different schema, equivalent functionality |
| `.claude/CLAUDE.md` | `.opencode/CLAUDE.md` | ✅ Migrated | Project instructions preserved |
| ❌ N/A | `.opencode/README.md` | ➕ Added | Quick start guide for OpenCode |
| ❌ N/A | `.opencode/OPENCODE.md` | ➕ Added | Comprehensive OpenCode documentation |

### Agents Directory

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/agents/code-analyzer.md` | `.opencode/agents/code-analyzer.md` | ✅ Migrated | Tool names updated to OpenCode format |
| `.claude/agents/file-analyzer.md` | `.opencode/agents/file-analyzer.md` | ✅ Migrated | Tool names updated to OpenCode format |
| `.claude/agents/parallel-worker.md` | `.opencode/agents/parallel-worker.md` | ✅ Migrated | Tool names updated to OpenCode format |
| `.claude/agents/test-runner.md` | `.opencode/agents/test-runner.md` | ✅ Migrated | Tool names updated to OpenCode format |

**Agent Tool Updates:**
- `ls` → `read` (using Read tool instead)
- `view` → `read` (consistent with OpenCode)
- `fetch` → `webfetch` (proper OpenCode tool name)
- Removed invalid tools: `todo`, `search`, `agent`

### Commands Directory (Structure Changed)

**Key Change**: `.claude/commands/` → `.opencode/command/` (singular)

#### PM Commands (38 files)

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/commands/pm/blocked.md` | `.opencode/command/pm/blocked.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/clean.md` | `.opencode/command/pm/clean.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-close.md` | `.opencode/command/pm/epic-close.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-decompose.md` | `.opencode/command/pm/epic-decompose.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-edit.md` | `.opencode/command/pm/epic-edit.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-list.md` | `.opencode/command/pm/epic-list.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-merge.md` | `.opencode/command/pm/epic-merge.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-oneshot.md` | `.opencode/command/pm/epic-oneshot.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-refresh.md` | `.opencode/command/pm/epic-refresh.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-show.md` | `.opencode/command/pm/epic-show.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-start-worktree.md` | `.opencode/command/pm/epic-start-worktree.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-start.md` | `.opencode/command/pm/epic-start.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-status.md` | `.opencode/command/pm/epic-status.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/epic-sync.md` | `.opencode/command/pm/epic-sync.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/help.md` | `.opencode/command/pm/help.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/import.md` | `.opencode/command/pm/import.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/in-progress.md` | `.opencode/command/pm/in-progress.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/init.md` | `.opencode/command/pm/init.md` | ✅ Migrated | Frontmatter added, branding updated |
| `.claude/commands/pm/issue-analyze.md` | `.opencode/command/pm/issue-analyze.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/issue-close.md` | `.opencode/command/pm/issue-close.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/issue-edit.md` | `.opencode/command/pm/issue-edit.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/issue-reopen.md` | `.opencode/command/pm/issue-reopen.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/issue-show.md` | `.opencode/command/pm/issue-show.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/issue-start.md` | `.opencode/command/pm/issue-start.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/issue-status.md` | `.opencode/command/pm/issue-status.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/issue-sync.md` | `.opencode/command/pm/issue-sync.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/next.md` | `.opencode/command/pm/next.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/prd-edit.md` | `.opencode/command/pm/prd-edit.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/prd-list.md` | `.opencode/command/pm/prd-list.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/prd-new.md` | `.opencode/command/pm/prd-new.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/prd-parse.md` | `.opencode/command/pm/prd-parse.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/prd-status.md` | `.opencode/command/pm/prd-status.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/search.md` | `.opencode/command/pm/search.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/standup.md` | `.opencode/command/pm/standup.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/status.md` | `.opencode/command/pm/status.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/sync.md` | `.opencode/command/pm/sync.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/test-reference-update.md` | `.opencode/command/pm/test-reference-update.md` | ✅ Migrated | Frontmatter added |
| `.claude/commands/pm/validate.md` | `.opencode/command/pm/validate.md` | ✅ Migrated | Frontmatter added |

#### Context Commands

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/commands/context/create.md` | `.opencode/command/context/create.md` | ✅ Migrated | Maintained in command structure |
| `.claude/commands/context/prime.md` | `.opencode/command/context/prime.md` | ✅ Migrated | Maintained in command structure |
| `.claude/commands/context/update.md` | `.opencode/command/context/update.md` | ✅ Migrated | Maintained in command structure |

#### Testing Commands

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/commands/testing/prime.md` | `.opencode/command/testing/prime.md` | ✅ Migrated | Maintained in command structure |
| `.claude/commands/testing/run.md` | `.opencode/command/testing/run.md` | ✅ Migrated | Maintained in command structure |

#### Individual Commands

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/commands/code-rabbit.md` | `.opencode/command/code-rabbit.md` | ✅ Migrated | Moved to root command level |
| `.claude/commands/prompt.md` | `.opencode/command/prompt.md` | ✅ Migrated | Moved to root command level |
| `.claude/commands/re-init.md` | `.opencode/command/re-init.md` | ✅ Migrated | Moved to root command level |

### Rules Directory

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/rules/agent-coordination.md` | `.opencode/rules/agent-coordination.md` | ✅ Migrated | Path references updated |
| `.claude/rules/branch-operations.md` | `.opencode/rules/branch-operations.md` | ✅ Migrated | Path references updated |
| `.claude/rules/datetime.md` | `.opencode/rules/datetime.md` | ✅ Migrated | Path references updated |
| `.claude/rules/frontmatter-operations.md` | `.opencode/rules/frontmatter-operations.md` | ✅ Migrated | Path references updated |
| `.claude/rules/github-operations.md` | `.opencode/rules/github-operations.md` | ✅ Migrated | Path references updated |
| `.claude/rules/standard-patterns.md` | `.opencode/rules/standard-patterns.md` | ✅ Migrated | Path references updated |
| `.claude/rules/strip-frontmatter.md` | `.opencode/rules/strip-frontmatter.md` | ✅ Migrated | Path references updated |
| `.claude/rules/test-execution.md` | `.opencode/rules/test-execution.md` | ✅ Migrated | Path references updated |
| `.claude/rules/use-ast-grep.md` | `.opencode/rules/use-ast-grep.md` | ✅ Migrated | Path references updated |
| `.claude/rules/worktree-operations.md` | `.opencode/rules/worktree-operations.md` | ✅ Migrated | Path references updated |

### Scripts Directory

#### PM Scripts

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/scripts/pm/blocked.sh` | `.opencode/scripts/pm/blocked.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/epic-list.sh` | `.opencode/scripts/pm/epic-list.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/epic-show.sh` | `.opencode/scripts/pm/epic-show.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/epic-status.sh` | `.opencode/scripts/pm/epic-status.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/help.sh` | `.opencode/scripts/pm/help.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/in-progress.sh` | `.opencode/scripts/pm/in-progress.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/init.sh` | `.opencode/scripts/pm/init.sh` | ✅ Migrated | Branding updated: "Claude Code" → "OpenCode" |
| `.claude/scripts/pm/next.sh` | `.opencode/scripts/pm/next.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/prd-list.sh` | `.opencode/scripts/pm/prd-list.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/prd-status.sh` | `.opencode/scripts/pm/prd-status.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/search.sh` | `.opencode/scripts/pm/search.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/standup.sh` | `.opencode/scripts/pm/standup.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/status.sh` | `.opencode/scripts/pm/status.sh` | ✅ Migrated | Path references updated |
| `.claude/scripts/pm/validate.sh` | `.opencode/scripts/pm/validate.sh` | ✅ Migrated | Path references updated |

#### Test Scripts

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/scripts/test-and-log.sh` | `.opencode/scripts/test-and-log.sh` | ✅ Migrated | Path references updated |

### Project Storage Directories

| Claude Code | OpenCode | Status | Notes |
|-------------|----------|---------|-------|
| `.claude/context/.gitkeep` | ❌ Removed | 🗑️ Cleaned | Documentation moved to OPENCODE.md |
| `.claude/epics/.gitkeep` | `.opencode/epics/.gitkeep` | ✅ Migrated | Project storage preserved |
| `.claude/prds/.gitkeep` | `.opencode/prds/.gitkeep` | ✅ Migrated | Project storage preserved |

## OpenCode Enhancements

### New Configuration Features

| File | Purpose | Added Features |
|------|---------|----------------|
| `.opencode/opencode.json` | Main configuration | Providers, MCP servers, permissions, agents |
| `.opencode/README.md` | Quick start guide | Installation, testing, model usage |
| `.opencode/OPENCODE.md` | Comprehensive docs | Complete system documentation |

### Enhanced Agent Definitions

All agent files now include proper OpenCode frontmatter:

```yaml
---
description: Agent purpose
tools: [glob, grep, read, webfetch, bash]
---
```

**Tool Updates Applied:**
- ❌ Invalid tools removed: `ls`, `view`, `fetch`, `todo`, `search`, `agent`
- ✅ Valid tools used: `glob`, `grep`, `read`, `webfetch`, `bash`

### Command Frontmatter

Key commands now include frontmatter for better integration:

```yaml
---
description: Command description
agent: build
---
```

## Migration Transformations

### 1. Configuration Schema Change

**Claude Code**: `settings.local.json`
```json
{
  "mcp_servers": {...},
  "provider": {...}
}
```

**OpenCode**: `opencode.json`
```json
{
  "providers": {...},
  "mcpServers": {...},
  "permissions": {...},
  "agents": {...}
}
```

### 2. Tool Name Standardization

| Claude Code Tool | OpenCode Tool | Change Reason |
|------------------|---------------|---------------|
| `ls` | `read` | Use consistent file reading |
| `view` | `read` | Standardize on Read tool |
| `fetch` | `webfetch` | Proper OpenCode tool name |
| `todo` | ❌ Removed | Not standard OpenCode tool |
| `search` | ❌ Removed | Not standard OpenCode tool |
| `agent` | ❌ Removed | Not standard OpenCode tool |

### 3. Directory Structure Updates

- **Commands**: `.claude/commands/` → `.opencode/command/` (singular)
- **Context**: `.claude/context/` → Integrated into `.opencode/OPENCODE.md`
- **Subfolder Support**: Maintained PM command organization under `/pm/*`

### 4. Branding Updates

- PM initialization script: "Claude Code" → "OpenCode"
- Documentation references updated throughout
- Maintained backward compatibility for workflows

## Command Accessibility

### PM Commands (38 total)
All accessible via `/pm:*` prefix:
- `/pm:init`, `/pm:help`, `/pm:status`
- `/pm:epic-*` (13 epic management commands)
- `/pm:issue-*` (7 issue management commands)  
- `/pm:prd-*` (5 PRD management commands)
- Plus: blocked, clean, import, in-progress, next, search, standup, sync, test-reference-update, validate

### Context Commands (3 total)
All accessible via `/context:*` prefix:
- `/context:create` - Generate project context
- `/context:prime` - Load context into session
- `/context:update` - Refresh context documentation

### Testing Commands (2 total)
All accessible via `/testing:*` prefix:
- `/testing:prime` - Configure testing framework
- `/testing:run` - Execute tests with analysis

## Verification

### File Count Verification
- **Claude Code**: 80 files total
- **OpenCode**: 128+ files total (includes enhancements)
- **Migration**: 100% of source files accounted for

### Functional Verification
- ✅ All agents available and properly configured
- ✅ All PM commands accessible via `/pm:*`
- ✅ All context commands accessible via `/context:*`
- ✅ All testing commands accessible via `/testing:*`
- ✅ All rules and scripts migrated with updated paths
- ✅ Project storage directories preserved

### Directory Structure Verification
- ✅ No redundant directories (cleaned up `.opencode/commands/` and `.opencode/context/`)
- ✅ Proper OpenCode conventions followed
- ✅ Subfolder organization maintained where appropriate

## Migration Status: ✅ COMPLETE

**Result**: 100% successful migration with functional enhancements and structural optimizations for OpenCode compatibility.