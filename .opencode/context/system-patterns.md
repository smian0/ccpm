---
created: 2025-09-16T00:11:07Z
last_updated: 2025-09-16T00:11:07Z
version: 1.0
author: Claude Code PM System
---

# System Patterns

## Architectural Patterns

### Context Preservation Pattern
**Purpose**: Maintain project state across AI sessions
**Implementation**: 
- Persistent context files in `.claude/context/` and `.opencode/context/`
- Agents read context before execution
- Updates written back to context files
- Frontmatter tracks creation and update timestamps

**Benefits**:
- No context loss between sessions
- Consistent project understanding
- Audit trail of changes
- Multi-agent coordination

### Agent Specialization Pattern
**Purpose**: Right tool for every job
**Implementation**:
- `code-analyzer`: Bug detection and code analysis
- `file-analyzer`: Log and verbose file processing
- `test-runner`: Test execution and result analysis
- `parallel-worker`: Coordination of multiple work streams

**Benefits**:
- Context isolation (agents don't pollute main thread)
- Specialized expertise for different tasks
- Parallel execution capability
- Concise result summaries

### Command-Driven Workflow Pattern
**Purpose**: Structured, repeatable processes
**Implementation**:
- Slash commands trigger specific workflows
- Commands organized by functional area (pm, context, testing)
- Each command has clear input/output contracts
- Commands spawn agents for heavy lifting

**Benefits**:
- Consistent execution patterns
- Clear user interface
- Modular and extensible
- Audit trail through command execution

### GitHub as Database Pattern
**Purpose**: Single source of truth for project state
**Implementation**:
- Issues represent tasks and epics
- Comments provide progress updates
- Labels organize and categorize
- Parent-child relationships for task hierarchy

**Benefits**:
- Team collaboration ready
- No separate database required
- Native GitHub integration
- Transparent progress tracking

## Design Patterns

### Strategy Pattern for AI Platforms
**Purpose**: Support multiple AI platforms with same functionality
**Implementation**:
- Abstract command interface
- Platform-specific implementations
- Shared core logic
- Configuration-driven platform selection

**Example**:
```bash
# Same command works on both platforms
/pm:prd-new feature-name

# Platform-specific implementations
.claude/commands/pm/prd-new.md    # Claude Code version
.opencode/commands/pm/prd-new.md  # OpenCode version
```

### Factory Pattern for Agent Creation
**Purpose**: Create appropriate agents for different tasks
**Implementation**:
- Task analysis determines agent type
- Agent configuration loaded from files
- Context isolation maintained
- Results consolidated appropriately

**Example**:
```bash
# Command analyzes task and creates appropriate agent
/pm:issue-start 1234
# -> Creates code-analyzer for bug fixes
# -> Creates parallel-worker for feature implementation
```

### Observer Pattern for Progress Tracking
**Purpose**: Real-time progress updates across multiple agents
**Implementation**:
- Agents emit progress events
- Central coordinator tracks status
- Updates written to context files
- GitHub sync for team visibility

**Example**:
```bash
# Multiple agents working in parallel
# Progress tracked centrally
# Updates synced to GitHub issues
```

### State Machine for Workflow Management
**Purpose**: Clear progression through development phases
**Implementation**:
- Defined states (PRD → Epic → Tasks → Issues → Code)
- State transitions triggered by commands
- Validation at each transition
- Rollback capabilities for errors

**Example**:
```bash
/pm:prd-new feature-name     # PRD state
/pm:prd-parse feature-name   # Epic state  
/pm:epic-decompose feature-name # Tasks state
/pm:epic-sync feature-name   # Issues state
```

## Data Flow Patterns

### Context-Driven Development Pattern
**Purpose**: All development decisions based on documented context
**Implementation**:
- Context files contain project state
- Agents read context before execution
- Decisions documented in context
- Context updated after execution

**Benefits**:
- No "vibe coding"
- Full traceability
- Consistent decision making
- Knowledge preservation

### Parallel Execution Pattern
**Purpose**: Multiple agents working simultaneously without conflicts
**Implementation**:
- Git worktrees for isolation
- Independent task assignments
- Context coordination
- Result consolidation

**Example**:
```bash
# Single issue spawns multiple parallel agents
/pm:issue-start 1234
# Agent 1: Database work in worktree-1
# Agent 2: API work in worktree-2
# Agent 3: UI work in worktree-3
# Consolidated results when complete
```

### Incremental Sync Pattern
**Purpose**: Efficient synchronization with minimal overhead
**Implementation**:
- Local work performed first
- Changes tracked incrementally
- Batch updates to GitHub
- Conflict resolution strategies

**Benefits**:
- Fast local operations
- Reduced API calls
- Offline capability
- Conflict minimization

### Template-Based Generation Pattern
**Purpose**: Consistent file and content generation
**Implementation**:
- Template files for common structures
- Variable substitution
- Validation of generated content
- Version-controlled templates

**Example**:
```bash
# PRD creation uses template
/pm:prd-new feature-name
# Generates consistent PRD structure
# With project-specific variables filled
```

## Error Handling Patterns

### Graceful Degradation Pattern
**Purpose**: System continues working with partial failures
**Implementation**:
- Independent agent failures
- Fallback to simpler approaches
- Progress preservation
- Clear error reporting

**Example**:
```bash
# If GitHub sync fails, work continues locally
# If agent fails, others continue
# Progress saved for retry
```

### Validation-First Pattern
**Purpose**: Catch errors early in the workflow
**Implementation**:
- Pre-flight checks before operations
- Validation at each workflow step
- Clear error messages
- Recovery suggestions

**Example**:
```bash
# Before creating context, check:
# - Directory permissions
# - Git repository status
# - Existing files
# - User confirmation
```

### Retry with Backoff Pattern
**Purpose**: Handle transient failures automatically
**Implementation**:
- Automatic retry for network failures
- Exponential backoff timing
- Maximum retry limits
- Fallback to manual intervention

**Example**:
```bash
# GitHub API failure
# Retry after 1s, 2s, 4s, 8s
# Then prompt user for manual action
```

## Integration Patterns

### Adapter Pattern for Tool Compatibility
**Purpose**: Support different AI platforms with same commands
**Implementation**:
- Platform-specific tool adapters
- Unified command interface
- Configuration-driven mapping
- Feature compatibility matrix

**Example**:
```bash
# Same command, different tools
# Claude Code: Read tool for file access
# OpenCode: View tool for file access
# Adapter maps between them
```

### Bridge Pattern for GitHub Integration
**Purpose**: Decouple GitHub operations from core logic
**Implementation**:
- GitHub operation abstraction
- Multiple implementation strategies
- Fallback mechanisms
- Error handling bridge

**Example**:
```bash
# GitHub operations through bridge
# Can use gh CLI, direct API, or fallback
# Core logic doesn't care about implementation
```

### Composite Pattern for Complex Operations
**Purpose**: Break complex operations into manageable parts
**Implementation**:
- Complex commands as composites
- Sub-commands for individual operations
- Shared context and state
- Coordinated execution

**Example**:
```bash
# /pm:epic-oneshot is composite of:
# /pm:epic-decompose
# /pm:epic-sync
# /pm:epic-start
# All coordinated together
```

## Security Patterns

### Least Privilege Pattern
**Purpose**: Minimize access and permissions
**Implementation**:
- Agents limited to task scope
- File access restricted to project
- GitHub access through user permissions
- No elevated privileges

### Secure Configuration Pattern
**Purpose**: Protect sensitive data and configurations
**Implementation**:
- Local configuration files
- Environment variables for secrets
- No hardcoded credentials
- Configuration validation

### Audit Trail Pattern
**Purpose**: Track all operations for accountability
**Implementation**:
- Command execution logging
- Agent operation tracking
- GitHub comment history
- Context file versioning