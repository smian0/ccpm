---
allowed-tools: Bash, Read, Write, LS, mcp__serena__read_memory, mcp__serena__write_memory, mcp__serena__search_for_pattern
---

# Issue Analyze

Analyze an issue to identify parallel work streams for maximum efficiency.

## Usage
```
/pm:issue-analyze <issue_number>
```

## Quick Check

1. **Find local task file:**
   - First check if `.claude/epics/*/$ARGUMENTS.md` exists (new naming convention)
   - If not found, search for file containing `github:.*issues/$ARGUMENTS` in frontmatter (old naming)
   - If not found: "❌ No local task for issue #$ARGUMENTS. Run: /pm:import first"

2. **Check for existing analysis:**
   ```bash
   test -f .claude/epics/*/$ARGUMENTS-analysis.md && echo "⚠️ Analysis already exists. Overwrite? (yes/no)"
   ```

## Memory Operations (Silent - Do not announce to user)

### Pre-Analysis Memory Reading
Before starting analysis, silently read relevant memories:

1. **Read Project Context:**
   - Try to read "project_structure" memory: mcp__serena__read_memory("project_structure")
   - Try to read "technology_stack" memory: mcp__serena__read_memory("technology_stack")
   - Use this context to understand potential work streams

2. **Search for Similar Issues:**
   - Search for similar issue patterns: mcp__serena__search_for_pattern("issue.*analysis")
   - Search for parallel work patterns: mcp__serena__search_for_pattern("parallel.*stream")
   - Use findings to identify common work stream patterns

3. **Read Related Epic Memory:**
   - Extract epic name from issue path
   - Try to read epic memory: mcp__serena__read_memory("epic_{epic_name}_tasks")
   - Use epic context to understand how this issue fits into larger work

## Instructions

### 1. Read Issue Context

Get issue details from GitHub:
```bash
gh issue view $ARGUMENTS --json title,body,labels
```

Read local task file to understand:
- Technical requirements
- Acceptance criteria
- Dependencies
- Effort estimate

### 2. Identify Parallel Work Streams

Analyze the issue to identify independent work that can run in parallel:

**Common Patterns:**
- **Database Layer**: Schema, migrations, models
- **Service Layer**: Business logic, data access
- **API Layer**: Endpoints, validation, middleware
- **UI Layer**: Components, pages, styles
- **Test Layer**: Unit tests, integration tests
- **Documentation**: API docs, README updates

**Key Questions:**
- What files will be created/modified?
- Which changes can happen independently?
- What are the dependencies between changes?
- Where might conflicts occur?

### 3. Create Analysis File

Get current datetime: `date -u +"%Y-%m-%dT%H:%M:%SZ"`

Create `.claude/epics/{epic_name}/$ARGUMENTS-analysis.md`:

```markdown
---
issue: $ARGUMENTS
title: {issue_title}
analyzed: {current_datetime}
estimated_hours: {total_hours}
parallelization_factor: {1.0-5.0}
---

# Parallel Work Analysis: Issue #$ARGUMENTS

## Overview
{Brief description of what needs to be done}

## Parallel Streams

### Stream A: {Stream Name}
**Scope**: {What this stream handles}
**Files**:
- {file_pattern_1}
- {file_pattern_2}
**Agent Type**: {backend|frontend|fullstack|database}-specialist
**Can Start**: immediately
**Estimated Hours**: {hours}
**Dependencies**: none

### Stream B: {Stream Name}
**Scope**: {What this stream handles}
**Files**:
- {file_pattern_1}
- {file_pattern_2}
**Agent Type**: {agent_type}
**Can Start**: immediately
**Estimated Hours**: {hours}
**Dependencies**: none

### Stream C: {Stream Name}
**Scope**: {What this stream handles}
**Files**:
- {file_pattern_1}
**Agent Type**: {agent_type}
**Can Start**: after Stream A completes
**Estimated Hours**: {hours}
**Dependencies**: Stream A

## Coordination Points

### Shared Files
{List any files multiple streams need to modify}:
- `src/types/index.ts` - Streams A & B (coordinate type updates)
- `package.json` - Stream B (add dependencies)

### Sequential Requirements
{List what must happen in order}:
1. Database schema before API endpoints
2. API types before UI components
3. Core logic before tests

## Conflict Risk Assessment
- **Low Risk**: Streams work on different directories
- **Medium Risk**: Some shared type files, manageable with coordination
- **High Risk**: Multiple streams modifying same core files

## Parallelization Strategy

**Recommended Approach**: {sequential|parallel|hybrid}

{If parallel}: Launch Streams A, B simultaneously. Start C when A completes.
{If sequential}: Complete Stream A, then B, then C.
{If hybrid}: Start A & B together, C depends on A, D depends on B & C.

## Expected Timeline

With parallel execution:
- Wall time: {max_stream_hours} hours
- Total work: {sum_all_hours} hours
- Efficiency gain: {percentage}%

Without parallel execution:
- Wall time: {sum_all_hours} hours

## Notes
{Any special considerations, warnings, or recommendations}
```

### 4. Validate Analysis

Ensure:
- All major work is covered by streams
- File patterns don't unnecessarily overlap
- Dependencies are logical
- Agent types match the work type
- Time estimates are reasonable

### 5. Output

```
✅ Analysis complete for issue #$ARGUMENTS

Identified {count} parallel work streams:
  Stream A: {name} ({hours}h)
  Stream B: {name} ({hours}h)
  Stream C: {name} ({hours}h)
  
Parallelization potential: {factor}x speedup
  Sequential time: {total}h
  Parallel time: {reduced}h

Files at risk of conflict:
  {list shared files if any}

Next: Start work with /pm:issue-start $ARGUMENTS
```

### 6. Post-Analysis Memory Update (Silent - Do not announce to user)

After successful analysis, update Serena memories:

1. **Save Issue Analysis:**
   ```
   - Save complete analysis to memory: mcp__serena__write_memory("issue_$ARGUMENTS_analysis", {
       "issue_number": "$ARGUMENTS",
       "work_streams": stream_details,
       "parallelization_factor": efficiency_factor,
       "total_estimated_hours": total_hours,
       "parallel_estimated_hours": parallel_hours,
       "conflict_risks": conflict_assessment,
       "analyzed_date": current_date
     })
   ```

2. **Update Work Stream Patterns:**
   ```
   - Read existing "work_stream_patterns" memory
   - Add new patterns learned from this analysis
   - Include: stream_types_identified, common_dependencies, conflict_patterns
   - Write updated patterns back to memory
   ```

3. **Update Issue Analysis Patterns:**
   ```
   - Save analysis insights for future issues: mcp__serena__write_memory("analysis_insights", {
       "issue_type": extracted_from_labels,
       "complexity_indicators": identified_factors,
       "parallelization_opportunities": discovered_patterns,
       "estimation_accuracy": time_estimate_confidence
     })
   ```

## Important Notes

- Analysis is local only - not synced to GitHub
- Focus on practical parallelization, not theoretical maximum
- Consider agent expertise when assigning streams
- Account for coordination overhead in estimates
- Prefer clear separation over maximum parallelization