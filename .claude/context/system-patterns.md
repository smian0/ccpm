---
created: 2025-09-16T23:46:13Z
last_updated: 2025-09-16T23:46:13Z
version: 1.0
author: Claude Code PM System
---

# System Patterns

## Architectural Patterns

### Command Pattern
**Implementation**: Each workflow operation is encapsulated as a discrete markdown command file
- **Structure**: `.claude/commands/{category}/{action}.md`
- **Execution**: Commands are parsed and executed by Claude Code
- **Parameters**: Commands accept arguments via `$ARGUMENTS` variable
- **Isolation**: Each command is self-contained with explicit dependencies

### Agent Pattern
**Implementation**: Specialized AI agents handle different types of work
- **Types**: General-purpose, code-analyzer, file-analyzer, test-runner, parallel-worker
- **Coordination**: Agents communicate through file-based state management
- **Context Preservation**: Agents provide summarized results to preserve main context
- **Parallel Execution**: Multiple agents work simultaneously on isolated work streams

### State Management Pattern
**Implementation**: File-based persistence using structured markdown with frontmatter
- **Format**: YAML frontmatter + Markdown content
- **Versioning**: Timestamps and version tracking in all state files
- **Validation**: Schema validation through frontmatter requirements
- **Synchronization**: State sync between local files and external systems (GitHub)

### Plugin Architecture Pattern
**Implementation**: MCP (Model Context Protocol) servers provide extensible functionality
- **Servers**: Serena (memory), OpenCode (transformation), others
- **Protocol**: Standardized communication via MCP
- **Integration**: Transparent integration through enhanced command prompts
- **Extensibility**: New capabilities added through additional MCP servers

## Design Patterns

### Workflow Pipeline Pattern
**Flow**: PRD → Epic → Tasks → GitHub Issues → Implementation → Completion
- **Stages**: Each stage has specific validation and transition criteria
- **Traceability**: Complete audit trail from requirements to implementation
- **Branching**: Parallel work streams branch from epics
- **Convergence**: All streams converge back to main development line

### Isolation Pattern
**Implementation**: Git worktrees provide isolated development environments
- **Creation**: Automatic worktree creation per epic
- **Independence**: Each worktree operates independently
- **Synchronization**: Controlled merge back to main development line
- **Cleanup**: Automatic worktree cleanup upon completion

### Memory Pattern (Serena Integration)
**Implementation**: Persistent memory system for learning and context preservation
- **Storage**: `.serena/memories/` with structured knowledge
- **Learning**: System learns from previous operations and decisions
- **Retrieval**: Semantic search and pattern matching for relevant context
- **Evolution**: Memory evolves with project development

### Transformation Pattern (OpenCode Integration)
**Implementation**: Command and agent transformation for compatibility
- **Mapping**: Commands mapped between Claude and OpenCode systems
- **Translation**: Agent specifications translated between formats
- **Bridging**: Seamless operation across different AI coding environments
- **Fallback**: Graceful degradation when transformations fail

## Data Flow Patterns

### Event-Driven Flow
```
User Command → Validation → Execution → State Update → Sync → Completion
```
- **Trigger**: User initiates command
- **Validation**: Preflight checks and requirement validation
- **Execution**: Core command logic with error handling
- **State Update**: Local state files updated
- **Sync**: External systems (GitHub) synchronized
- **Completion**: Results reported to user

### Parallel Execution Flow
```
Issue Analysis → Work Stream Identification → Agent Spawning → Parallel Execution → Result Consolidation
```
- **Analysis**: Issue decomposed into parallel work streams
- **Identification**: Dependencies and conflicts analyzed
- **Spawning**: Multiple agents launched with specific tasks
- **Execution**: Agents work simultaneously in isolated environments
- **Consolidation**: Results merged and conflicts resolved

### Context Flow
```
Project State → Context Files → Memory Sync → Command Enhancement → Improved Decisions
```
- **State Capture**: Current project state documented in context files
- **Memory Sync**: Context automatically synced to Serena memories
- **Enhancement**: Commands enhanced with contextual knowledge
- **Decision Making**: Better decisions based on accumulated context

## Error Handling Patterns

### Graceful Degradation
- **Primary Path**: Full functionality with all integrations working
- **Degraded Path**: Core functionality continues if integrations fail
- **Fallback**: Manual processes available when automation fails
- **Recovery**: Automatic retry and recovery mechanisms

### Fail-Fast Validation
- **Early Validation**: Input validation before expensive operations
- **Dependency Checks**: Verify dependencies before command execution
- **State Validation**: Ensure valid state before proceeding
- **Clear Messages**: Specific error messages with remediation steps

### Atomic Operations
- **All-or-Nothing**: Operations either complete fully or rollback completely
- **State Consistency**: No partial state corruption
- **Transaction Boundaries**: Clear transaction boundaries for complex operations
- **Rollback**: Automatic rollback on failure

## Integration Patterns

### Adapter Pattern
**Implementation**: Adapters for different external systems
- **GitHub**: GitHub CLI adapter for issue and repository management
- **Git**: Git command adapter for repository operations
- **MCP**: MCP server adapters for extended functionality
- **File System**: File system adapter for state management

### Observer Pattern
**Implementation**: State change notification and synchronization
- **Local Changes**: Local state changes trigger sync operations
- **External Changes**: External system changes reflected locally
- **Conflict Resolution**: Automatic and manual conflict resolution
- **Change Propagation**: Changes propagated across all relevant systems

### Strategy Pattern
**Implementation**: Different strategies for different scenarios
- **Execution Strategy**: Sequential vs parallel execution based on analysis
- **Sync Strategy**: Different sync strategies for different external systems
- **Agent Strategy**: Different agent types for different work types
- **Installation Strategy**: Different installation approaches for different environments

## Performance Patterns

### Caching Pattern
- **File System Cache**: Local file system caching for expensive operations
- **Memory Cache**: In-memory caching for frequently accessed data
- **Result Cache**: Caching of command results for repeated operations
- **Invalidation**: Cache invalidation on state changes

### Lazy Loading Pattern
- **On-Demand**: Load context and state only when needed
- **Progressive**: Progressive loading of complex project state
- **Deferred**: Defer expensive operations until necessary
- **Streaming**: Stream large datasets rather than loading completely

### Batch Processing Pattern
- **Command Batching**: Multiple related commands executed as batch
- **State Batching**: Multiple state updates batched together
- **Sync Batching**: Multiple sync operations batched for efficiency
- **Agent Batching**: Multiple agent tasks batched when possible