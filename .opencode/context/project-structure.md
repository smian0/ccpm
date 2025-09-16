---
created: 2025-09-16T00:11:07Z
last_updated: 2025-09-16T16:15:05Z
version: 1.2
author: Claude Code PM System
---

# Project Structure

## Root Directory Organization

```
ccpm/
├── .claude/                    # Claude Code configuration
│   ├── agents/                # Task-oriented agents
│   ├── commands/              # Command definitions
│   │   ├── context/           # Context management commands
│   │   ├── pm/                # Project management commands
│   │   └── testing/           # Testing commands
│   ├── context/               # Project-wide context files
│   ├── epics/                 # PM's local workspace
│   ├── prds/                  # Product requirement documents
│   ├── rules/                 # Standard patterns and rules
│   └── scripts/               # Utility scripts
├── .claude-ext/              # Extended Claude Code configuration
│   ├── agents/               # Additional agents
│   └── CLAUDE.md             # Extended agent documentation
├── .opencode/                # OpenCode configuration
│   ├── agents/               # OpenCode agent definitions
│   ├── commands/             # OpenCode command definitions
│   ├── context/              # OpenCode context files
│   ├── rules/                # OpenCode rules
│   └── scripts/              # OpenCode scripts
├── .opencode-ext/            # Extended OpenCode configuration
│   ├── agents/               # Additional OpenCode agents
│   └── CLAUDE.md             # Extended OpenCode agent documentation
├── .serena/                  # Serena configuration
│   ├── .gitignore           # Serena gitignore
│   └── project.yml          # Serena project configuration
├── install/                  # Installation scripts and documentation
├── tests/                    # Test files and specifications
├── .gitignore                # Git ignore rules
├── AGENTS.md                 # Agent documentation
├── CLAUDE.md                 # Symlink to AGENTS.md
├── COMMANDS.md               # Command documentation
├── install-ccpm.sh           # Local installation script
├── install-ccpm-overrides.sh # Installation override script
├── LICENSE                   # MIT License
├── README.md                 # Main project documentation
└── screenshot.webp           # Project screenshot
```

## Key Directories

### Configuration Directories
- **`.claude/`**: Claude Code specific configuration and PM system
- **`.opencode/`**: OpenCode configuration with equivalent functionality
- Both directories provide similar structure but for different AI platforms

### Command Systems
- **`.claude/commands/pm/`**: Project management commands (epic, issue, PRD management)
- **`.claude/commands/context/`**: Context creation and management commands
- **`.claude/commands/testing/`**: Test execution and validation commands
- **`.opencode/commands/`**: OpenCode-compatible command definitions

### Agent Systems
- **`.claude/agents/`**: Claude Code agents (code-analyzer, file-analyzer, test-runner, parallel-worker)
- **`.opencode/agents/`**: OpenCode agents with similar functionality

### Workspace Areas
- **`.claude/epics/`**: Local workspace for epic and task files (gitignored)
- **`.claude/prds/`**: Product requirement documents
- **`.claude/context/`**: Project-wide context files
- **`.opencode/context/`**: OpenCode context files

## File Naming Patterns

### Command Files
- Format: `command-name.md`
- Location: `.claude/commands/pm/` or `.opencode/commands/`
- Example: `epic-decompose.md`, `issue-start.md`

### Agent Files
- Format: `agent-type.md`
- Location: `.claude/agents/` or `.opencode/agents/`
- Example: `code-analyzer.md`, `parallel-worker.md`

### Epic Files
- Format: `epic-name/epic.md` (main epic file)
- Format: `epic-name/[issue-id].md` (task files)
- Location: `.claude/epics/`

### PRD Files
- Format: `prd-name.md`
- Location: `.claude/prds/`

### Context Files
- Format: `context-type.md`
- Location: `.claude/context/` or `.opencode/context/`
- Example: `progress.md`, `project-structure.md`

## Module Organization

### Core PM System
- **Commands**: Modular command structure for different operations
- **Agents**: Specialized agents for different types of work
- **Context**: Persistent context across sessions
- **Rules**: Standard patterns and best practices

### Integration Layers
- **GitHub Integration**: Issue management, sync operations
- **Git Worktrees**: Parallel development isolation
- **OpenCode Integration**: Alternative AI platform support
- **MCP Servers**: Enhanced documentation and context

### Documentation
- **README.md**: Main project documentation
- **AGENTS.md**: Agent system documentation
- **COMMANDS.md**: Command reference documentation
- **Install Guides**: Platform-specific installation instructions

## File Organization Principles

### Separation of Concerns
- Configuration files separated from implementation
- Commands organized by functional area
- Agents specialized by task type
- Context files separated by purpose

### Git Strategy
- Core project files tracked in git
- Workspace areas (epics/) gitignored for local work
- Configuration files tracked but with local overrides
- Installation scripts versioned with project

### Platform Compatibility
- Claude Code and OpenCode configurations coexist
- Shared functionality with platform-specific implementations
- Gradual migration path between platforms
- Backward compatibility maintained

## Development Workflow Structure

### Local Development
- Work in `.claude/epics/` directories
- Context maintained in `.claude/context/`
- Commands executed through slash commands
- Agents handle specialized tasks

### GitHub Integration
- Issues created from epic/task files
- Progress synced through explicit commands
- Parent-child relationships maintained
- Labels and organization automated

### Parallel Execution
- Multiple agents work simultaneously
- Git worktrees provide isolation
- Context preserved across sessions
- Progress tracked and consolidated