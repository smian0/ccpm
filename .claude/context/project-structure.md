---
created: 2025-09-16T23:46:13Z
last_updated: 2025-09-16T23:46:13Z
version: 1.0
author: Claude Code PM System
---

# Project Structure

## Root Directory Organization

```
ccpm/
├── .claude/                    # Claude Code configuration and commands
├── .claude-ext/               # Extension overrides and enhancements  
├── .opencode/                 # OpenCode integration layer
├── .serena/                   # Serena MCP server data
├── install/                   # Installation scripts and utilities
├── server/                    # Server components (if any)
├── tests/                     # Testing infrastructure
├── venv/                      # Python virtual environment
└── [root files]               # Documentation and configuration
```

## Core Directory Details

### `.claude/` - Primary Command System
```
.claude/
├── commands/
│   ├── pm/                    # Project management commands (30+ files)
│   ├── context/               # Context management commands
│   └── testing/               # Testing workflow commands
├── context/                   # Project documentation (this directory)
├── epics/                     # Feature specifications and task breakdowns
├── prds/                      # Product requirement documents
├── rules/                     # Operational guidelines and standards
├── scripts/                   # Supporting shell scripts
├── settings.local.json        # Local configuration
└── CLAUDE.md                  # Main configuration and instructions
```

### `.claude-ext/` - Extension Layer
```
.claude-ext/
├── commands/
│   └── pm/                    # Enhanced PM commands with Serena integration
├── CLAUDE.md                  # Enhanced configuration with Serena
└── [extension files]          # Override and enhancement files
```

### `.opencode/` - OpenCode Integration
```
.opencode/
├── command/                   # OpenCode command mappings
├── context/                   # OpenCode context files (untracked)
├── epics/                     # OpenCode epic storage (untracked)
├── prds/                      # OpenCode PRD storage (untracked)
├── rules/                     # OpenCode operational rules
├── scripts/                   # OpenCode supporting scripts
├── node_modules/              # Node.js dependencies
├── package.json               # Node.js package configuration
└── opencode.json              # OpenCode configuration
```

## Key File Types and Patterns

### Command Files
- **Location**: `.claude/commands/pm/*.md`
- **Format**: Markdown with YAML frontmatter
- **Purpose**: Executable workflow commands
- **Naming**: kebab-case with descriptive names (e.g., `epic-decompose.md`)

### Context Files
- **Location**: `.claude/context/*.md`
- **Format**: Markdown with YAML frontmatter containing metadata
- **Purpose**: Project documentation and state
- **Standard Files**: 9 core context files covering all project aspects

### Epic Files
- **Location**: `.claude/epics/{epic-name}/`
- **Structure**: 
  - `epic.md` - Epic specification
  - `{number}.md` - Individual task files (001.md, 002.md, etc.)
  - `{issue-number}-analysis.md` - Issue analysis files

### PRD Files
- **Location**: `.claude/prds/{feature-name}.md`
- **Format**: Structured markdown with comprehensive requirements
- **Purpose**: Product requirement documentation

### Rule Files
- **Location**: `.claude/rules/*.md`
- **Purpose**: Operational guidelines (datetime, frontmatter, etc.)
- **Usage**: Referenced by commands for consistent behavior

## File Naming Conventions

### Standard Patterns
- **Commands**: `{action}-{object}.md` (e.g., `epic-decompose.md`)
- **Epics**: `{epic-name}/` directory with numbered tasks
- **PRDs**: `{feature-name}.md` in kebab-case
- **Context**: `{context-type}.md` with descriptive names

### Frontmatter Standards
All markdown files include YAML frontmatter with:
```yaml
---
created: [ISO 8601 datetime]
last_updated: [ISO 8601 datetime]
version: [semantic version]
author: [creator identification]
[additional metadata as needed]
---
```

## Integration Points

### Git Integration
- **Worktrees**: Created in `../epic-{name}` directories
- **Branch Strategy**: Feature branches per epic/issue
- **State Tracking**: Git status integrated into progress tracking

### GitHub Integration
- **Issue Sync**: Local tasks synchronized with GitHub issues
- **Repository**: Origin at github.com/smian0/ccpm.git
- **Upstream**: github.com/automazeio/ccpm.git

### MCP Server Integration
- **Serena**: Memory storage in `.serena/memories/`
- **OpenCode**: Configuration in `.opencode/opencode.json`
- **Protocol**: Model Context Protocol for server communication

## Module Organization

### Command Modules
- **PM Commands**: Core project management functionality
- **Context Commands**: Project documentation management
- **Testing Commands**: Quality assurance workflows

### Agent Modules
- **Specialized Agents**: Different agent types for various work streams
- **Parallel Execution**: Agent coordination for simultaneous work
- **Context Preservation**: Agent communication while preserving context

### Integration Modules
- **Installation**: Scripts for setup and configuration
- **Transformation**: Command and agent transformation layers
- **Synchronization**: State sync between different systems