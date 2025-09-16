---
created: 2025-09-16T00:15:00Z
last_updated: 2025-09-16T00:15:00Z
version: 1.0
author: Claude Code PM System
---

# Project Overview

## High-Level Summary

Claude Code PM (CCPM) is a battle-tested project management system that transforms the chaos of AI-assisted development into a structured, traceable workflow. It bridges the gap between product vision and shipped code through a disciplined process that eliminates context loss, enables parallel execution, and maintains full accountability.

## Core Capabilities

### 🧠 Context Preservation System
- **Persistent State**: Project context survives across AI sessions
- **Agent Coordination**: Multiple AI agents share coherent understanding
- **Session Continuity**: Pick up exactly where you left off
- **Knowledge Retention**: No repeated explanations or rediscovery

### ⚡ Parallel Execution Engine
- **Multi-Agent Coordination**: 3-8 agents working simultaneously per epic
- **Conflict-Free Development**: Git worktrees provide isolation
- **Intelligent Task Distribution**: Agents specialize by work type
- **Consolidated Results**: Clean integration of parallel work streams

### 📋 Spec-Driven Development Workflow
- **PRD Creation**: Comprehensive product requirement documentation
- **Epic Planning**: Technical implementation with architectural decisions
- **Task Decomposition**: Concrete, actionable development tasks
- **Full Traceability**: Every line of code traces back to requirements

### 🔗 Native GitHub Integration
- **Issues as Database**: GitHub issues provide single source of truth
- **Team Collaboration**: Human and AI progress visible to all
- **Parent-Child Relationships**: Epics track sub-task completion
- **Progress Transparency**: Real-time updates without meetings

## Key Features

### Product Management Layer
- **PRD Management**: Create, edit, and lifecycle management of requirements
- **Epic Planning**: Transform PRDs into technical implementation plans
- **Task Breakdown**: Decompose epics into parallel-executable tasks
- **Progress Tracking**: Real-time status across all work streams

### Development Orchestration
- **Agent Specialization**: Right tool for every job (UI, API, database, testing)
- **Parallel Coordination**: Multiple agents per issue without conflicts
- **Context Isolation**: Agents work independently while maintaining coherence
- **Result Consolidation**: Clean integration of distributed work

### GitHub Workflow Integration
- **Issue Creation**: Automatic issue generation from local planning
- **Progress Synchronization**: Bidirectional sync between local and GitHub
- **Team Visibility**: Comments and updates for human team members
- **Audit Trail**: Complete history from idea to production

### Command Interface
- **Slash Commands**: Simple, memorable interface for all operations
- **Workflow Automation**: Multi-step processes executed with single commands
- **Intelligent Defaults**: Smart behavior based on project context
- **Error Recovery**: Graceful handling of failures and edge cases

## System Architecture

### Local Workspace
```
.claude/epics/feature-name/
├── epic.md              # Implementation plan
├── 001.md               # Task files (become issue IDs)
├── 002.md               # Parallel development tasks
└── updates/             # Work-in-progress tracking
```

### GitHub Integration
```
GitHub Issues
├── Epic Issue (#1234)   # Parent epic with task list
├── Task Issue (#1235)   # Individual development tasks
└── Sub-Issues           # Detailed implementation work
```

### Agent Coordination
```
Issue #1235 → Multiple Agents
├── Agent 1: Database work (worktree-1)
├── Agent 2: API endpoints (worktree-2)
├── Agent 3: UI components (worktree-3)
└── Agent 4: Tests/docs  (worktree-4)
```

## Workflow Phases

### 1. Product Planning
**Command**: `/pm:prd-new feature-name`
- Guided brainstorming for comprehensive requirements
- User stories, success criteria, and constraints
- Market analysis and competitive positioning
- **Output**: `.claude/prds/feature-name.md`

### 2. Implementation Planning
**Command**: `/pm:prd-parse feature-name`
- Technical architecture and design decisions
- Dependency mapping and risk assessment
- Resource estimation and timeline planning
- **Output**: `.claude/epics/feature-name/epic.md`

### 3. Task Decomposition
**Command**: `/pm:epic-decompose feature-name`
- Break epic into concrete, actionable tasks
- Parallelization analysis and conflict detection
- Acceptance criteria and effort estimation
- **Output**: Individual task files with parallel execution flags

### 4. GitHub Synchronization
**Command**: `/pm:epic-sync feature-name`
- Create GitHub issues from local planning
- Establish parent-child relationships
- Apply appropriate labels and organization
- **Output**: Live GitHub issues ready for development

### 5. Parallel Execution
**Command**: `/pm:issue-start 1234`
- Analyze task for parallelization opportunities
- Spawn specialized agents for different work streams
- Coordinate through Git worktrees and context files
- **Output**: Concurrent development across multiple agents

## Platform Support

### Claude Code Integration
- **Native Support**: Full feature compatibility
- **Command System**: Slash commands for all operations
- **Agent Coordination**: Specialized agents for different tasks
- **Context Management**: Persistent state across sessions

### OpenCode Integration
- **Full Compatibility**: All commands and agents ported
- **MCP Integration**: Enhanced documentation through context7
- **Tool Mapping**: OpenCode tools mapped to Claude equivalents
- **Live Documentation**: Always-current API docs and examples

## Benefits and Outcomes

### Development Velocity
- **3x Faster Delivery**: Parallel execution vs serial development
- **89% Less Context Switching**: Persistent context eliminates rediscovery
- **75% Fewer Bugs**: Structured planning catches issues early
- **5-8 Parallel Tasks**: vs 1 task in traditional workflows

### Team Collaboration
- **Human-AI Coordination**: Seamless handoffs between humans and AI
- **Transparent Progress**: All work visible in GitHub issues
- **Distributed Teams**: Remote-friendly with built-in documentation
- **Knowledge Sharing**: Context preservation benefits entire team

### Quality and Reliability
- **Full Traceability**: Every decision documented and linked
- **Consistent Architecture**: Documented patterns enforced
- **Error Recovery**: Graceful handling of failures and edge cases
- **Audit Compliance**: Complete history for regulatory requirements

## Competitive Advantages

### vs Traditional PM Tools
- **AI-Native Design**: Built specifically for AI-assisted development
- **No Separate Database**: Uses GitHub issues as single source of truth
- **Context Preservation**: Maintains state across AI sessions
- **Parallel Execution**: Multiple agents working simultaneously

### vs Code-Only AI Tools
- **Structured Process**: Prevents "vibe coding" and technical debt
- **Team Integration**: GitHub visibility for human team members
- **Full Lifecycle**: From PRD to production with complete traceability
- **Scalable Collaboration**: Supports teams, not just individual developers

### vs Generic Project Management
- **Developer-Centric**: Designed by and for software developers
- **GitHub Integration**: Works with tools developers already use
- **AI Optimization**: Specifically designed for AI agent coordination
- **No Learning Curve**: Familiar GitHub workflows with enhanced capabilities

## Usage Patterns

### Individual Developers
- **Solo AI Development**: Structured approach to AI-assisted coding
- **Context Preservation**: Never lose project state between sessions
- **Quality Assurance**: Built-in review and validation processes
- **Portfolio Building**: Documented process for professional growth

### Development Teams
- **Human-AI Collaboration**: Seamless coordination between team members and AI
- **Progress Transparency**: Real-time visibility into all work streams
- **Knowledge Transfer**: Context preservation enables easy handoffs
- **Scalable Processes**: Consistent workflows across team members

### Technical Leadership
- **Architecture Governance**: Documented decisions and patterns
- **Progress Monitoring**: Real-time dashboard through GitHub issues
- **Quality Control**: Review processes built into the workflow
- **Resource Planning**: Clear visibility into development capacity

## Success Metrics

### Quantitative Results
- **Development Speed**: 3x faster feature delivery
- **Context Efficiency**: 89% reduction in context switching time
- **Quality Improvement**: 75% reduction in bug rates
- **Parallel Execution**: 3-8 simultaneous work streams per epic
- **Documentation Compliance**: 100% traceability from PRD to code

### Qualitative Outcomes
- **Developer Satisfaction**: Reduced frustration with context loss
- **Team Alignment**: Shared understanding across human and AI contributors
- **Process Confidence**: Reliable, repeatable development workflows
- **Product Quality**: Higher-quality outcomes through structured planning
- **Knowledge Retention**: Institutional knowledge preserved in documentation