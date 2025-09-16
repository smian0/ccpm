---
created: 2025-09-16T00:15:00Z
last_updated: 2025-09-16T00:15:00Z
version: 1.0
author: Claude Code PM System
---

# Project Style Guide

## Coding Standards and Conventions

### File Organization Principles

#### Directory Structure
- **Functional Grouping**: Organize files by functional area (commands, agents, context)
- **Platform Separation**: Separate directories for Claude Code (.claude/) and OpenCode (.opencode/)
- **Consistent Naming**: Use kebab-case for directories and files
- **Clear Hierarchy**: Nested structure reflects logical relationships

#### File Naming Conventions
```bash
# Command files
/commands/pm/epic-decompose.md
/commands/context/create.md
/commands/testing/run.md

# Agent files
/agents/code-analyzer.md
/agents/parallel-worker.md

# Context files
/context/project-overview.md
/context/tech-context.md

# Epic and task files
/epics/feature-name/epic.md
/epics/feature-name/001.md (becomes 1234.md after GitHub sync)
```

### Markdown Documentation Standards

#### Frontmatter Format
All documentation files must include standardized frontmatter:

```yaml
---
created: 2025-09-16T00:15:00Z
last_updated: 2025-09-16T00:15:00Z
version: 1.0
author: Claude Code PM System
---
```

#### Header Structure
```markdown
# Primary Title (H1)
## Major Section (H2)
### Subsection (H3)
#### Detail Section (H4)
```

#### Content Organization
- **Purpose First**: Start with clear statement of purpose
- **Examples Included**: Provide concrete examples for all concepts
- **Action-Oriented**: Focus on what users should do
- **Consistent Terminology**: Use established terms throughout

#### Code Block Standards
```bash
# Use descriptive comments
/pm:prd-new feature-name    # Create new PRD
/pm:epic-decompose feature-name    # Break into tasks

# Show expected outputs
# Output: .claude/epics/feature-name/epic.md
```

### Command File Structure

#### Standard Template
```markdown
# Command Name

## Purpose
[Clear, single sentence describing what this command does]

## Usage
```bash
/command:action parameter
```

## Parameters
- **parameter**: Description of parameter purpose and constraints

## Process
1. Step one with clear action
2. Step two with expected outcome
3. Final step with verification

## Output
- **Files Created**: List of files and their purposes
- **GitHub Integration**: What gets synced to GitHub
- **Context Updates**: How context is modified

## Examples
[Real-world examples with expected outputs]

## Error Handling
[Common errors and solutions]
```

### Agent File Structure

#### Standard Template
```markdown
# Agent Name

## Purpose
[Single sentence describing the agent's specialized function]

## When to Use
- Specific scenario 1
- Specific scenario 2
- When NOT to use this agent

## Capabilities
- What this agent can do
- Tools it has access to
- Limitations and constraints

## Integration
- How it coordinates with other agents
- Context requirements
- Output format

## Examples
[Usage examples with expected outcomes]
```

### Shell Script Standards

#### Script Organization
```bash
#!/bin/bash
# Script purpose and usage

set -euo pipefail  # Strict error handling

# Configuration section
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Function definitions
function main() {
    # Main logic here
}

function error_handler() {
    echo "Error on line $1" >&2
    exit 1
}

trap 'error_handler $LINENO' ERR

# Execute main function
main "$@"
```

#### Error Handling
```bash
# Check prerequisites
command -v gh >/dev/null 2>&1 || {
    echo "Error: GitHub CLI is required but not installed" >&2
    exit 1
}

# Validate inputs
if [[ -z "${1:-}" ]]; then
    echo "Usage: $0 <epic-name>" >&2
    exit 1
fi

# Graceful error messages
if ! gh auth status >/dev/null 2>&1; then
    echo "Error: Please authenticate with GitHub CLI first:" >&2
    echo "  gh auth login" >&2
    exit 1
fi
```

### JSON Configuration Standards

#### OpenCode Configuration
```json
{
    "version": "1.0",
    "permissions": [
        "write_files",
        "bash",
        "read_files",
        "web_fetch"
    ],
    "agents": {
        "agent-name": {
            "model": "claude-3-5-sonnet-20241022",
            "system": "Clear, concise system prompt",
            "tools": ["specific", "tools", "list"]
        }
    }
}
```

#### Validation Rules
- All JSON must be valid and properly formatted
- No hardcoded absolute paths
- Use environment variables for user-specific values
- Include version information for tracking

### Git Workflow Standards

#### Commit Message Format
```bash
# Format: <type>(<scope>): <description>
feat(agents): Add parallel execution coordination
fix(github): Handle API rate limiting gracefully
docs(commands): Update epic-decompose examples
refactor(context): Simplify context loading logic
```

#### Branch Naming
```bash
# Feature branches
feature/agent-specialization
feature/opencode-integration

# Bug fixes
fix/github-sync-error
fix/context-preservation

# Documentation
docs/command-reference
docs/installation-guide
```

#### Merge Strategy
- **Squash commits** for feature branches
- **Preserve history** for major changes
- **Require reviews** for core functionality
- **Test before merge** with validation scripts

### Documentation Quality Standards

#### Writing Style
- **Concise and Clear**: Avoid unnecessary words
- **Action-Oriented**: Tell users what to do
- **Example-Driven**: Show, don't just tell
- **Consistent Voice**: Use active voice and present tense

#### Technical Accuracy
- **Test All Examples**: Every code example must work
- **Keep Current**: Update docs with code changes
- **Version Tracking**: Track documentation versions
- **Cross-References**: Link related concepts

#### User Experience
- **Progressive Disclosure**: Start simple, add complexity
- **Quick Wins**: Show immediate value
- **Troubleshooting**: Anticipate common problems
- **Multiple Learning Styles**: Visual and textual examples

### Code Quality Standards

#### Shell Script Quality
```bash
# Use meaningful variable names
readonly epic_name="$1"
readonly epic_dir="${EPICS_DIR}/${epic_name}"

# Include error checking
if [[ ! -d "$epic_dir" ]]; then
    echo "Error: Epic directory not found: $epic_dir" >&2
    exit 1
fi

# Use functions for reusable logic
function validate_epic_structure() {
    local epic_dir="$1"
    
    if [[ ! -f "${epic_dir}/epic.md" ]]; then
        return 1
    fi
    
    return 0
}
```

#### Error Handling Philosophy
- **Fail Fast**: Detect errors as early as possible
- **Clear Messages**: Provide actionable error information
- **Graceful Recovery**: Offer solutions when possible
- **Context Preservation**: Don't lose work on errors

### Configuration Management

#### Environment Variables
```bash
# Use consistent naming
CCPM_GITHUB_TOKEN="${GITHUB_TOKEN:-}"
CCPM_EPIC_DIR="${CCPM_EPIC_DIR:-${HOME}/.claude/epics}"
CCPM_DEBUG="${CCPM_DEBUG:-false}"

# Provide defaults
readonly DEFAULT_BRANCH="main"
readonly DEFAULT_LABEL_PREFIX="epic"
```

#### Configuration Files
- **Local Overrides**: Allow user customization
- **Environment-Specific**: Support development, staging, production
- **Validation**: Check configuration on startup
- **Documentation**: Document all configuration options

### Testing Standards

#### Test Structure
```bash
#!/bin/bash
# test-epic-decompose.sh

set -euo pipefail

function setup() {
    # Create test environment
    export TEST_DIR="$(mktemp -d)"
    export CCPM_EPIC_DIR="$TEST_DIR/epics"
    mkdir -p "$CCPM_EPIC_DIR"
}

function teardown() {
    # Clean up test environment
    rm -rf "$TEST_DIR"
}

function test_basic_decomposition() {
    # Test case implementation
    local result
    result="$(epic_decompose test-epic)"
    
    assert_equals "Expected output" "$result"
}

# Run tests
setup
test_basic_decomposition
teardown
```

#### Test Coverage
- **All Commands**: Every command must have tests
- **Error Conditions**: Test failure scenarios
- **Integration Points**: Test GitHub integration
- **Performance**: Test with realistic data sizes

### Security Standards

#### Sensitive Data Handling
```bash
# Never log sensitive data
if [[ "$CCPM_DEBUG" == "true" ]]; then
    echo "Debug: Processing epic $epic_name" >&2
    # Don't log tokens or API keys
fi

# Use secure temporary files
readonly temp_file="$(mktemp)"
trap 'rm -f "$temp_file"' EXIT
```

#### Authentication
- **Use System Auth**: Leverage existing GitHub CLI authentication
- **No Stored Secrets**: Don't store API keys in configuration
- **Minimal Permissions**: Request only necessary permissions
- **Audit Trail**: Log authentication events

### Performance Standards

#### Response Time Targets
- **Context Loading**: < 10 seconds
- **Command Execution**: < 30 seconds
- **GitHub Sync**: < 2 minutes
- **Agent Startup**: < 5 seconds

#### Optimization Guidelines
```bash
# Cache expensive operations
if [[ ! -f "$cache_file" ]] || [[ "$source_file" -nt "$cache_file" ]]; then
    generate_cache "$source_file" > "$cache_file"
fi

# Use parallel processing where safe
pids=()
for task in "${tasks[@]}"; do
    process_task "$task" &
    pids+=($!)
done

# Wait for completion
for pid in "${pids[@]}"; do
    wait "$pid"
done
```

### Accessibility and Usability

#### Command Interface Design
- **Memorable Names**: Use intuitive command names
- **Consistent Patterns**: Follow established conventions
- **Clear Help**: Provide comprehensive help text
- **Progressive Complexity**: Start simple, allow advanced usage

#### Error Message Quality
```bash
# Good error message
echo "Error: Epic 'feature-name' not found in $CCPM_EPIC_DIR" >&2
echo "Available epics:" >&2
ls "$CCPM_EPIC_DIR" 2>/dev/null | sed 's/^/  /' >&2
echo "Run '/pm:epic-list' to see all epics" >&2

# Bad error message
echo "Error: Not found" >&2
```

### Maintenance Standards

#### Code Lifecycle
- **Regular Reviews**: Quarterly code quality reviews
- **Dependency Updates**: Monthly dependency updates
- **Performance Monitoring**: Track performance metrics
- **Technical Debt**: Regular refactoring cycles

#### Documentation Maintenance
- **Automated Checks**: Verify examples and links
- **Version Alignment**: Keep docs current with code
- **User Feedback**: Incorporate user suggestions
- **Regular Updates**: Quarterly documentation reviews

This style guide ensures consistency, quality, and maintainability across the entire CCPM project, enabling effective collaboration between contributors and reliable user experiences.