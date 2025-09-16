---
allowed-tools: Bash, Read, Write, LS, mcp__serena__read_memory, mcp__serena__write_memory, mcp__serena__search_for_pattern
---

# PRD New

Launch brainstorming for new product requirement document.

## Usage
```
/pm:prd-new <feature_name>
```

## Required Rules

**IMPORTANT:** Before executing this command, read and follow:
- `.claude/rules/datetime.md` - For getting real current date/time

## Preflight Checklist

Before proceeding, complete these validation steps.
Do not bother the user with preflight checks progress ("I'm not going to ..."). Just do them and move on.

### Input Validation
1. **Validate feature name format:**
   - Must contain only lowercase letters, numbers, and hyphens
   - Must start with a letter
   - No spaces or special characters allowed
   - If invalid, tell user: "❌ Feature name must be kebab-case (lowercase letters, numbers, hyphens only). Examples: user-auth, payment-v2, notification-system"

2. **Check for existing PRD:**
   - Check if `.claude/prds/$ARGUMENTS.md` already exists
   - If it exists, ask user: "⚠️ PRD '$ARGUMENTS' already exists. Do you want to overwrite it? (yes/no)"
   - Only proceed with explicit 'yes' confirmation
   - If user says no, suggest: "Use a different name or run: /pm:prd-parse $ARGUMENTS to create an epic from the existing PRD"

3. **Verify directory structure:**
   - Check if `.claude/prds/` directory exists
   - If not, create it first
   - If unable to create, tell user: "❌ Cannot create PRD directory. Please manually create: .claude/prds/"

## Memory Operations (Silent - Do not announce to user)

### Pre-PRD Memory Reading
Before starting PRD creation, silently read relevant memories:

1. **Read Project Context:**
   - Try to read "project_overview" memory: mcp__serena__read_memory("project_overview")
   - Try to read "technology_stack" memory: mcp__serena__read_memory("technology_stack")
   - Try to read "project_structure" memory: mcp__serena__read_memory("project_structure")
   - Use this context to inform PRD decisions and constraints

2. **Search for Similar PRDs:**
   - Search for similar PRD patterns: mcp__serena__search_for_pattern("prd.*feature")
   - Search for product requirements: mcp__serena__search_for_pattern("product.*requirement")
   - Use findings to follow established patterns and avoid conflicts

3. **Read Product Vision:**
   - Try to read "product_vision" memory if it exists
   - Use to align new feature with overall product direction

## Instructions

You are a product manager creating a comprehensive Product Requirements Document (PRD) for: **$ARGUMENTS**

Follow this structured approach:

### 1. Discovery & Context
- Ask clarifying questions about the feature/product "$ARGUMENTS"
- Understand the problem being solved
- Identify target users and use cases
- Gather constraints and requirements

### 2. PRD Structure
Create a comprehensive PRD with these sections:

#### Executive Summary
- Brief overview and value proposition

#### Problem Statement
- What problem are we solving?
- Why is this important now?

#### User Stories
- Primary user personas
- Detailed user journeys
- Pain points being addressed

#### Requirements
**Functional Requirements**
- Core features and capabilities
- User interactions and flows

**Non-Functional Requirements**
- Performance expectations
- Security considerations
- Scalability needs

#### Success Criteria
- Measurable outcomes
- Key metrics and KPIs

#### Constraints & Assumptions
- Technical limitations
- Timeline constraints
- Resource limitations

#### Out of Scope
- What we're explicitly NOT building

#### Dependencies
- External dependencies
- Internal team dependencies

### 3. File Format with Frontmatter
Save the completed PRD to: `.claude/prds/$ARGUMENTS.md` with this exact structure:

```markdown
---
name: $ARGUMENTS
description: [Brief one-line description of the PRD]
status: backlog
created: [Current ISO date/time]
---

# PRD: $ARGUMENTS

## Executive Summary
[Content...]

## Problem Statement
[Content...]

[Continue with all sections...]
```

### 4. Frontmatter Guidelines
- **name**: Use the exact feature name (same as $ARGUMENTS)
- **description**: Write a concise one-line summary of what this PRD covers
- **status**: Always start with "backlog" for new PRDs
- **created**: Get REAL current datetime by running: `date -u +"%Y-%m-%dT%H:%M:%SZ"`
  - Never use placeholder text
  - Must be actual system time in ISO 8601 format

### 5. Quality Checks

Before saving the PRD, verify:
- [ ] All sections are complete (no placeholder text)
- [ ] User stories include acceptance criteria
- [ ] Success criteria are measurable
- [ ] Dependencies are clearly identified
- [ ] Out of scope items are explicitly listed

### 6. Post-Creation

After successfully creating the PRD:
1. Confirm: "✅ PRD created: .claude/prds/$ARGUMENTS.md"
2. Show brief summary of what was captured
3. Suggest next step: "Ready to create implementation epic? Run: /pm:prd-parse $ARGUMENTS"

### 7. Post-Creation Memory Update (Silent - Do not announce to user)

After successful PRD creation, update Serena memories:

1. **Save PRD Insights:**
   ```
   - Save PRD summary to memory: mcp__serena__write_memory("prd_$ARGUMENTS_insights", {
       "feature_name": "$ARGUMENTS",
       "problem_statement": extracted_problem,
       "target_users": identified_users,
       "success_criteria": defined_metrics,
       "technical_constraints": identified_constraints,
       "dependencies": listed_dependencies,
       "created_date": current_date
     })
   ```

2. **Update PRD Patterns:**
   ```
   - Read existing "prd_patterns" memory
   - Add new patterns learned from this PRD creation
   - Include: question_types_used, requirement_categories, success_metric_types
   - Write updated patterns back to memory
   ```

3. **Update Product Vision:**
   ```
   - If this PRD reveals new product direction insights, update "product_vision" memory
   - Add feature alignment notes and strategic connections
   - Include: vision_alignment, strategic_value, market_fit_insights
   ```

## Error Recovery

If any step fails:
- Clearly explain what went wrong
- Provide specific steps to fix the issue
- Never leave partial or corrupted files

Conduct a thorough brainstorming session before writing the PRD. Ask questions, explore edge cases, and ensure comprehensive coverage of the feature requirements for "$ARGUMENTS".
