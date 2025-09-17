---
created: 2025-09-16T23:46:13Z
last_updated: 2025-09-16T23:46:13Z
version: 1.0
author: Claude Code PM System
---

# Technical Context

## Primary Technologies
- **Shell Scripting (Bash)**: Primary implementation language for command system
- **Markdown**: Documentation and specification format
- **Git**: Version control and worktree management
- **GitHub CLI (gh)**: GitHub integration and issue management
- **Python**: Testing infrastructure and virtual environment

## Core Dependencies
- **Git**: Required for worktree management and repository operations
- **GitHub CLI**: Essential for issue synchronization and repository management
- **Claude Code**: Host environment for all operations
- **Bash**: Shell environment for command execution

## Development Tools
- **Virtual Environment**: Python venv for isolated testing
- **pytest**: Testing framework (evidenced by .pytest_cache)
- **MCP Servers**: Model Context Protocol integrations
  - **Serena**: Semantic code operations and memory management  
  - **OpenCode**: Enhanced code analysis and transformation

## Architecture Pattern
- **Command-Based Architecture**: Discrete commands for each workflow operation
- **Agent-Based Execution**: Specialized agents for different types of work
- **File-Based State Management**: Markdown files for persistent state
- **Plugin System**: Extensible through MCP server integrations

## File Structure Standards
- **Commands**: `.claude/commands/` - Executable workflow commands
- **Context**: `.claude/context/` - Project documentation and state
- **Rules**: `.claude/rules/` - Operational guidelines and standards
- **Scripts**: `.claude/scripts/` - Supporting shell scripts
- **Epics**: `.claude/epics/` - Feature specifications and task breakdowns
- **PRDs**: `.claude/prds/` - Product requirement documents

## Integration Points
- **GitHub API**: Via GitHub CLI for issue and repository management
- **Git Worktrees**: For parallel development environment isolation
- **Claude Code**: Host environment providing AI capabilities
- **MCP Protocol**: For extending functionality through specialized servers

## Development Environment
- **Python 3.13**: Virtual environment for testing and development tools
- **Node.js**: Supporting OpenCode integration (package.json in .opencode/)
- **Shell Environment**: Primary execution environment for all commands

## Configuration Management
- **Frontmatter**: YAML metadata in Markdown files for structured data
- **JSON Configuration**: Settings and state in .opencode/opencode.json
- **Environment Variables**: Runtime configuration through shell environment

## Testing Strategy
- **Shell Script Testing**: test-installer.sh for installation validation
- **Integration Testing**: Tests directory with comprehensive validation
- **Log-Based Verification**: Structured logging for operation tracking

## Security Considerations
- **No Credential Storage**: Relies on GitHub CLI authentication
- **Local File System**: All operations are local file system based
- **Git Security**: Follows standard Git security practices
- **MCP Server Trust**: Relies on trusted MCP server implementations

## Performance Characteristics
- **File-Based Operations**: Fast local file system operations
- **Parallel Execution**: Agent-based parallelism for complex operations
- **Git Operations**: Efficient worktree management for isolation
- **Minimal Dependencies**: Lightweight with standard Unix tools