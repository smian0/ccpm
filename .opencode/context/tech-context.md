---
created: 2025-09-16T00:11:07Z
last_updated: 2025-09-16T16:15:05Z
version: 1.2
author: Claude Code PM System
---

# Technical Context

## Technology Stack

### Core Technologies
- **Shell Scripting**: Bash scripts for installation and utilities
- **Markdown**: Documentation and configuration files
- **Git**: Version control and worktree management
- **GitHub**: Issue tracking and collaboration platform

### AI Platforms
- **Claude Code**: Primary AI development platform
- **OpenCode**: Alternative AI platform with enhanced features
- **Anthropic Claude**: AI model provider (Claude 3.5 Sonnet, etc.)

### Development Tools
- **GitHub CLI (gh)**: Command-line interface for GitHub operations
- **gh-sub-issue**: Extension for parent-child issue relationships
- **Python**: v3.13 (for MCP servers and OpenCode integration)
- **Virtual Environment**: venv/ for Python dependencies

## Dependencies

### System Dependencies
- **Git**: Version control system (required)
- **Bash**: Shell environment for scripts
- **curl/wget**: For installation scripts
- **GitHub CLI**: For GitHub integration

### Python Dependencies (venv/)
- **MCP Servers**: Model Context Protocol servers for enhanced AI capabilities
- **HTTP Libraries**: For API interactions
- **JSON Processing**: For configuration handling
- **Documentation Tools**: For context7 integration

### External Services
- **GitHub API**: For issue and repository management
- **Anthropic API**: For AI model interactions
- **Context7 MCP**: For live documentation
- **Local MCP Servers**: Markdown processing and other specialized tools

## Configuration Files

### Claude Code Configuration
- **`.claude/settings.local.json`**: Local Claude Code settings
- **`.claude/CLAUDE.md`**: Always-on instructions (symlink to AGENTS.md)
- **`.claude/agents/*.md`**: Agent definitions and prompts
- **`.claude/commands/**/*.md`**: Command definitions and workflows

### OpenCode Configuration
- **`.opencode/opencode.json`**: OpenCode configuration file with MCP server definitions
- **`.opencode/agents/*.md`**: OpenCode agent definitions
- **`.opencode/commands/**/*.md`**: OpenCode command definitions
- **`.opencode/context/*.md`**: OpenCode context files

### Project Configuration
- **`.gitignore`**: Git ignore rules
- **`LICENSE`**: MIT License
- **`README.md`**: Project documentation
- **`install-ccpm.sh`**: Installation script

## Development Environment

### Platform Information
- **Operating System**: macOS (Darwin)
- **Shell**: Bash
- **Python Version**: 3.13
- **Git Version**: Current system git
- **Node.js**: Not detected (not a Node.js project)

### Environment Setup
- **Virtual Environment**: Python venv in `venv/`
- **Git Repository**: Initialized with remote origin
- **GitHub CLI**: Configured with authentication
- **Working Directory**: Clean with minor configuration changes

### Build and Deployment
- **Installation**: Shell script-based installation
- **Configuration**: File-based configuration system
- **Deployment**: Git-based distribution
- **Dependencies**: Managed through installation scripts

## Architecture Patterns

### Configuration Management
- **File-based Configuration**: JSON and Markdown files
- **Modular Structure**: Separated by functional area
- **Platform-specific**: Separate configs for Claude Code and OpenCode
- **Local Overrides**: Local settings override defaults

### Command System
- **Slash Commands**: Triggered by `/command:action` syntax
- **Modular Commands**: Organized by functional area
- **Agent Integration**: Commands spawn specialized agents
- **Context Preservation**: Commands maintain context across sessions

### Agent System
- **Specialized Agents**: Different agents for different tasks
- **Context Isolation**: Each agent manages its own context
- **Parallel Execution**: Multiple agents work simultaneously
- **Result Consolidation**: Agents return concise summaries

## Integration Points

### GitHub Integration
- **Issue Management**: Create, update, and sync GitHub issues
- **Repository Operations**: Branch management, commit handling
- **Collaboration Features**: Comments, labels, relationships
- **API Usage**: GitHub CLI and direct API calls

### Git Integration
- **Worktree Support**: Parallel development in isolated branches
- **Branch Management**: Feature branch workflows
- **Commit Handling**: Automated commit messages and tracking
- **Status Tracking**: Git status integration

### AI Platform Integration
- **Claude Code**: Primary platform with full feature support
- **OpenCode**: Alternative platform with MCP integration
- **Model Access**: Anthropic Claude models
- **Tool Integration**: Platform-specific tool mappings
- **MCP Servers**: Local and remote Model Context Protocol servers for enhanced capabilities

## Security Considerations

### Authentication
- **GitHub Authentication**: Through GitHub CLI
- **API Keys**: Managed through platform configurations
- **Local Storage**: Configuration files stored locally
- **Environment Variables**: Used for sensitive data

### Data Privacy
- **Local Processing**: Most operations performed locally
- **GitHub Data**: Stored in GitHub issues and repository
- **AI Interactions**: Processed through Anthropic API
- **Context Files**: Stored locally in project directory

### Access Control
- **File Permissions**: Standard Unix file permissions
- **Git Access**: Through GitHub authentication
- **Repository Access**: Based on GitHub permissions
- **Agent Access**: Limited to project scope

## Performance Considerations

### Context Management
- **Context Preservation**: Maintained across sessions
- **Context Optimization**: Agents reduce context pollution
- **File Caching**: Local file access for performance
- **Incremental Updates**: Only sync changes when needed

### Parallel Processing
- **Agent Parallelism**: Multiple agents work simultaneously
- **Worktree Isolation**: Parallel development without conflicts
- **Resource Management**: Agents manage their own resources
- **Result Consolidation**: Efficient summary generation

### Network Usage
- **GitHub API**: Efficient API usage with caching
- **AI API**: Optimized prompt engineering
- **Documentation**: Local caching where possible
- **Installation**: Minimal network dependencies