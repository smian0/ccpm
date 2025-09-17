---
name: stow-removal
description: Remove stowing setup and related configurations since OpenCode is now global
status: complete
created: 2025-09-17T00:04:32Z
---

# PRD: Stow Removal

## Executive Summary
Remove the stowing mechanism from CCPM since OpenCode integration is now handled globally, eliminating the need for local stowing setup and simplifying the project structure.

## Problem Statement
The current project includes stowing functionality (`.stow/` directory and related scripts) that was previously used for OpenCode integration. Since OpenCode is now handled globally, this stowing mechanism is redundant and adds unnecessary complexity to the project.

**Why this is important now:**
- Simplifies project structure and reduces maintenance overhead
- Eliminates confusing legacy code paths
- Reduces installation complexity
- Aligns with the new global OpenCode approach

## User Stories

**As a developer using CCPM:**
- I want a clean project structure without legacy stowing mechanisms
- I want simplified installation without stow-related setup steps
- I don't want to encounter confusing stow-related files or configurations

**As a maintainer:**
- I want to reduce technical debt by removing unused functionality
- I want clearer project organization without obsolete components

## Requirements

### Functional Requirements
- Remove `.stow/` directory and all its contents
- Remove any stow-related installation scripts or commands
- Remove stow-related configuration from any setup files
- Ensure all remaining functionality works without stowing

### Non-Functional Requirements
- No breaking changes to core CCPM functionality
- Clean removal without leaving orphaned references
- Simple, atomic change that can be easily reviewed

## Success Criteria
- `.stow/` directory completely removed from repository
- No references to stowing in installation scripts
- No stow-related configuration remains
- All existing CCPM commands and workflows function normally
- Project structure is simpler and cleaner

## Constraints & Assumptions
- OpenCode integration is fully handled globally and doesn't require local stowing
- No users are actively depending on the stowing mechanism
- This is a cleanup/simplification task, not a feature addition

## Out of Scope
- Modifying OpenCode global configuration
- Changing core CCPM workflow functionality
- Migration paths for existing stow users (assuming none exist)
- Documentation updates beyond removing stow references

## Dependencies
- None - this is a pure removal/cleanup task

## Implementation Approach
1. **Identify Stow Components**: Catalog all stow-related files and configurations
2. **Remove Files**: Delete `.stow/` directory and contents
3. **Clean Scripts**: Remove stow references from installation/setup scripts
4. **Verify**: Ensure no broken references remain
5. **Test**: Validate that core functionality works without stowing

## Acceptance Criteria
- [ ] `.stow/` directory deleted
- [ ] No stow references in any scripts
- [ ] No stow-related configuration remains
- [ ] All PM commands function normally
- [ ] Installation process works without stow steps
- [ ] No orphaned references to stowing mechanism