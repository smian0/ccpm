---
created: 2025-09-16T23:46:13Z
last_updated: 2025-09-16T23:46:13Z
version: 1.0
author: Claude Code PM System
---

# Project Style Guide

## File Naming Conventions

### Command Files
- **Format**: `{action}-{object}.md`
- **Examples**: `epic-decompose.md`, `issue-analyze.md`, `prd-new.md`
- **Case**: kebab-case (all lowercase with hyphens)
- **Descriptive**: Action verb + object being acted upon

### Context Files
- **Format**: `{context-type}.md`
- **Examples**: `project-structure.md`, `tech-context.md`, `progress.md`
- **Case**: kebab-case
- **Scope**: Clear indication of context scope and purpose

### Epic and Task Files
- **Epic Directory**: `{epic-name}/` (kebab-case)
- **Epic File**: `epic.md` within epic directory
- **Task Files**: `{number}.md` (zero-padded: 001.md, 002.md, etc.)
- **Analysis Files**: `{issue-number}-analysis.md`

### PRD Files
- **Format**: `{feature-name}.md`
- **Case**: kebab-case
- **Example**: `user-authentication.md`, `payment-processing-v2.md`

## Frontmatter Standards

### Required Fields
All markdown files MUST include YAML frontmatter with these required fields:
```yaml
---
created: [ISO 8601 datetime in UTC]
last_updated: [ISO 8601 datetime in UTC]
version: [semantic version]
author: [creator identification]
---
```

### DateTime Format
- **Standard**: ISO 8601 format with UTC timezone
- **Format**: `YYYY-MM-DDTHH:MM:SSZ`
- **Example**: `2025-09-16T23:46:13Z`
- **Source**: Always use real system time via `date -u +"%Y-%m-%dT%H:%M:%SZ"`

### Command-Specific Frontmatter
**Commands with Tools**:
```yaml
---
allowed-tools: Bash, Read, Write, LS, Task
---
```

**State Files (PRDs, Epics, Tasks)**:
```yaml
---
name: [descriptive name]
status: [backlog|in-progress|completed|blocked]
created: [ISO datetime]
updated: [ISO datetime]
github: [GitHub issue/PR URL when synced]
---
```

## Markdown Formatting Standards

### Header Hierarchy
- **H1 (#)**: File title only (one per file)
- **H2 (##)**: Major sections
- **H3 (###)**: Subsections within major sections
- **H4 (####)**: Minor subsections when needed
- **H5+ (#####)**: Avoid; restructure content instead

### Code Blocks
**Shell Commands**:
```bash
# Use bash syntax highlighting
git status --short
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

**Configuration Files**:
```yaml
# Use appropriate language highlighting
name: example-task
status: in-progress
```

**File Structure Examples**:
```
# Use plain text for directory structures
project/
├── directory/
│   ├── file.md
│   └── other.md
└── another-file.md
```

### Lists and Formatting
**Task Lists**:
- Use `- [ ]` for incomplete tasks
- Use `- [x]` for completed tasks
- Use `- ✅` for definitely completed items
- Use `- 📋` for planned/scheduled items
- Use `- 🔄` for in-progress items

**Emphasis**:
- **Bold** for important terms and concepts
- *Italic* for emphasis or foreign terms
- `Code` for commands, filenames, and technical terms
- **Never use ALL CAPS** for emphasis

## Command Structure Standards

### Command File Format
```markdown
---
allowed-tools: [list of required tools]
---

# Command Title

Brief description of command purpose.

## Usage
```
/command:name <arguments>
```

## Required Rules
[List any rule files that must be read]

## Preflight Checklist
[Validation steps before execution]

## Instructions
[Detailed command logic and flow]

## Error Recovery
[Error handling and recovery procedures]
```

### Command Flow Pattern
1. **Preflight Checklist**: Validation before execution
2. **Instructions**: Core command logic
3. **Error Handling**: Recovery and fallback procedures
4. **Post-Command**: Cleanup and state updates

### Argument Handling
- Use `$ARGUMENTS` for command arguments
- Validate arguments in preflight checklist
- Provide clear error messages for invalid arguments
- Support both single and multiple arguments where appropriate

## Documentation Standards

### Section Organization
**Context Files**:
1. Purpose and scope
2. Current state
3. Historical information
4. Future plans/roadmap
5. Key relationships and dependencies

**Command Files**:
1. Purpose and usage
2. Prerequisites and validation
3. Step-by-step instructions
4. Error handling
5. Success criteria

### Writing Style
- **Clear and Concise**: Avoid unnecessary verbosity
- **Action-Oriented**: Use active voice and imperative mood
- **Specific**: Provide concrete examples and specific instructions
- **User-Focused**: Write from the user's perspective

### Code Examples
- **Complete**: Show complete, working examples
- **Commented**: Include explanatory comments
- **Realistic**: Use realistic example data
- **Tested**: Verify all examples work as shown

## Version Control Standards

### Commit Messages
- **Format**: `{type}: {description}` (conventional commits)
- **Types**: feat, fix, docs, style, refactor, test, chore
- **Description**: Imperative mood, no period, <50 characters
- **Example**: `feat: add parallel task execution support`

### Branch Naming
- **Feature**: `feature/{epic-name}` or `feature/{issue-number}`
- **Fix**: `fix/{issue-number}` or `fix/{description}`
- **Epic**: `epic/{epic-name}` (for epic worktrees)

### File Updates
- **Always Update `last_updated`**: When modifying any file
- **Preserve `created`**: Never change the original creation timestamp
- **Version Bumps**: Increment version for significant changes

## Error Message Standards

### Error Format
```
❌ [Clear problem description]

[Specific details about what went wrong]

[Actionable steps to resolve]
```

### Success Messages
```
✅ [Action completed successfully]

[Brief summary of what was accomplished]
[Next step suggestions if applicable]
```

### Warning Messages
```
⚠️ [Warning description]

[Context and implications]
[Recommended action if any]
```

## Testing Standards

### Shell Script Testing
- **Test Files**: `test-{component}.sh` in tests directory
- **Validation**: Test all major workflows end-to-end
- **Error Cases**: Test error conditions and recovery
- **Documentation**: Document test scenarios and expected outcomes

### Integration Testing
- **GitHub Integration**: Test issue sync and repository operations
- **Git Operations**: Test worktree creation and management
- **Command Chaining**: Test complex command sequences
- **Agent Coordination**: Test parallel agent execution

## Performance Guidelines

### File Size Limits
- **Context Files**: Aim for <2000 lines for readability
- **Command Files**: Aim for <500 lines for maintainability
- **Epic Files**: No strict limit but prioritize clarity
- **Task Files**: <100 lines each for focused scope

### Command Efficiency
- **Minimal Dependencies**: Use only necessary tools
- **Fast Validation**: Quick preflight checks
- **Efficient Operations**: Optimize for common use cases
- **Parallel Execution**: Support parallel operation where possible

### Memory Management
- **Context Preservation**: Use agents to manage large contexts
- **File-Based State**: Prefer file-based over memory-based state
- **Cleanup**: Clean up temporary files and resources
- **Efficient Sync**: Minimize unnecessary GitHub API calls