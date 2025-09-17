---
name: stow-removal
status: completed
created: 2025-09-17T00:07:13Z
updated: 2025-09-17T00:24:27Z
completed: 2025-09-17T00:24:27Z
progress: 100%
prd: .claude/prds/stow-removal.md
github: [Will be updated when synced to GitHub]
---

# Epic: Stow Removal

## Overview
Remove the legacy stowing mechanism from CCPM since OpenCode integration is now handled globally. This is a pure cleanup task to eliminate redundant functionality and simplify the project structure.

## Architecture Decisions
- **Pure Removal Strategy**: No replacement functionality needed since OpenCode is global
- **Atomic Cleanup**: Single focused change to remove all stow-related components
- **Zero Migration**: No users depend on stowing mechanism, safe to remove completely

## Technical Approach
### Directory Cleanup
- Remove `.stow/` directory and all contents
- No filesystem restructuring needed beyond deletion

### Script Cleanup  
- Remove stow references from installation and setup scripts
- Update documentation to remove stow mentions
- No new scripts or functionality required

### Validation
- Verify no broken references remain after removal
- Test core CCPM functionality still works without stowing
- Leverage existing test infrastructure

## Implementation Strategy
- **Single Phase**: Complete removal in one atomic change
- **Risk Mitigation**: Simple deletion with verification - minimal risk
- **Testing**: Use existing PM commands to verify functionality

## Task Breakdown Preview
High-level task categories that will be created:
- [ ] Audit and Catalog: Identify all stow-related components
- [ ] Directory Removal: Delete .stow/ directory and contents  
- [ ] Script Cleanup: Remove stow references from scripts and docs
- [ ] Verification: Test functionality and clean up orphaned references

## Dependencies
- None - this is a standalone cleanup task with no external dependencies

## Success Criteria (Technical)
- `.stow/` directory completely removed from repository
- Zero references to "stow" in installation/setup scripts  
- All existing CCPM PM commands function normally
- Clean `git status` with no orphaned files or references
- Project structure simplified without functional regression

## Estimated Effort
- **Overall Timeline**: 1-2 hours of focused work
- **Resource Requirements**: Single developer
- **Critical Path**: Linear sequence of removal → cleanup → verification
- **Complexity**: Low - pure deletion with minimal validation needed