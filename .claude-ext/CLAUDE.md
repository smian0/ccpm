# CLAUDE.md - Enhanced with Transparent Serena Integration

> Think carefully and implement the most concise solution that changes as little code as possible.

## Automatic Serena Integration

### Global Command Enhancement

Before executing **any** `/pm:*` command, silently perform these operations:

#### 1. Serena Project Activation
```
- Check if Serena project is active
- If not active: mcp__serena__activate_project ccpm
- This happens transparently - never announce to user
```

#### 2. Context-to-Memory Sync (If Needed)
```
- Check if any Serena memories exist: mcp__serena__list_memories
- If no memories AND .claude/context/ files exist:
  - Read .claude/context/progress.md → write_memory("project_overview", content)
  - Read .claude/context/tech-context.md → write_memory("technology_stack", content)
  - Read .claude/context/project-structure.md → write_memory("project_structure", content)
  - Read .claude/context/project-brief.md → write_memory("project_brief", content)
  - Read .claude/context/system-patterns.md → write_memory("architectural_patterns", content)
  - Read .claude/context/product-context.md → write_memory("product_requirements", content)
  - Read .claude/context/project-style-guide.md → write_memory("code_style_conventions", content)
  - Read .claude/context/project-vision.md → write_memory("strategic_direction", content)
  - Read .claude/context/project-overview.md → write_memory("feature_summary", content)
  - This comprehensive auto-sync happens once, silently
```

#### 3. Command-Specific Memory Operations
Each PM command will:
- Read relevant memories before operation
- Search for related past work if applicable
- Write new insights after operation
- All memory operations are silent and transparent

### Memory Naming Patterns

**Core Project Knowledge:**
- `project_structure` - Code organization and architecture
- `technology_stack` - Framework, language, and tool choices
- `project_overview` - Current progress and status
- `project_brief` - Project goals and objectives
- `architectural_patterns` - Design patterns and architectural decisions
- `product_requirements` - Product context and requirements
- `code_style_conventions` - Coding standards and style guide
- `strategic_direction` - Project vision and strategic context
- `feature_summary` - Feature overview and summary

**Dynamic Learning Patterns:**
- `task_patterns` - Common task breakdown patterns learned over time
- `epic_{name}_tasks` - Task breakdown for specific epics
- `issue_{number}_analysis` - Analysis insights for specific issues
- `prd_{name}_insights` - Product requirement insights

### Enhanced Command Behavior
Commands retain their exact same interface but gain:
- **Memory persistence** - Insights survive across sessions
- **Context awareness** - Commands know project history
- **Pattern learning** - System improves over time
- **Semantic search** - Find related work automatically

### Fallback Behavior
- If Serena unavailable: Commands work normally without memory
- If memory operations fail: Log error, continue with command
- Never block command execution due to memory issues

## USE SUB-AGENTS FOR CONTEXT OPTIMIZATION

### 1. Always use the file-analyzer sub-agent when asked to read files.
The file-analyzer agent is an expert in extracting and summarizing critical information from files, particularly log files and verbose outputs. It provides concise, actionable summaries that preserve essential information while dramatically reducing context usage.

### 2. Always use the code-analyzer sub-agent when asked to search code, analyze code, research bugs, or trace logic flow.

The code-analyzer agent is an expert in code analysis, logic tracing, and vulnerability detection. It provides concise, actionable summaries that preserve essential information while dramatically reducing context usage.

### 3. Always use the test-runner sub-agent to run tests and analyze the test results.

Using the test-runner agent ensures:

- Full test output is captured for debugging
- Main conversation stays clean and focused
- Context usage is optimized
- All issues are properly surfaced
- No approval dialogs interrupt the workflow

## Philosophy

### Error Handling

- **Fail fast** for critical configuration (missing text model)
- **Log and continue** for optional features (extraction model)
- **Graceful degradation** when external services unavailable
- **User-friendly messages** through resilience layer

### Testing

- Always use the test-runner agent to execute tests.
- Do not use mock services for anything ever.
- Do not move on to the next test until the current test is complete.
- If the test fails, consider checking if the test is structured correctly before deciding we need to refactor the codebase.
- Tests to be verbose so we can use them for debugging.

## Tone and Behavior

- Criticism is welcome. Please tell me when I am wrong or mistaken, or even when you think I might be wrong or mistaken.
- Please tell me if there is a better approach than the one I am taking.
- Please tell me if there is a relevant standard or convention that I appear to be unaware of.
- Be skeptical.
- Be concise.
- Short summaries are OK, but don't give an extended breakdown unless we are working through the details of a plan.
- Do not flatter, and do not give compliments unless I am specifically asking for your judgement.
- Occasional pleasantries are fine.
- Feel free to ask many questions. If you are in doubt of my intent, don't guess. Ask.

## ABSOLUTE RULES:

- NO PARTIAL IMPLEMENTATION
- NO SIMPLIFICATION : no "//This is simplified stuff for now, complete implementation would blablabla"
- NO CODE DUPLICATION : check existing codebase to reuse functions and constants Read files before writing new functions. Use common sense function name to find them easily.
- NO DEAD CODE : either use or delete from codebase completely
- IMPLEMENT TEST FOR EVERY FUNCTIONS
- NO CHEATER TESTS : test must be accurate, reflect real usage and be designed to reveal flaws. No useless tests! Design tests to be verbose so we can use them for debuging.
- NO INCONSISTENT NAMING - read existing codebase naming patterns.
- NO OVER-ENGINEERING - Don't add unnecessary abstractions, factory patterns, or middleware when simple functions would work. Don't think "enterprise" when you need "working"
- NO MIXED CONCERNS - Don't put validation logic inside API handlers, database queries inside UI components, etc. instead of proper separation
- NO RESOURCE LEAKS - Don't forget to close database connections, clear timeouts, remove event listeners, or clean up file handles

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.