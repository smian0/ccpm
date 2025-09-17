# Claude-OpenCode Agent Integration Design

## Executive Summary

Design document for enabling seamless integration between Claude Code agents and OpenCode, allowing all global Claude agents to be available in OpenCode workspaces through a unified configuration system.

## Current State Analysis

### Architecture Overview

```
┌─ Global Configuration ─────────────────────────────────────┐
│                                                            │
│  ~/.claude/agents/ ──→ dotfiles/claude/.claude/agents/     │
│  (14 global Claude agents)                                 │
│                                                            │
│  ~/.config/opencode/agent/ ──→ dotfiles/opencode/.config/  │
│  opencode/agent/ (4 OpenCode-specific agents)             │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌─ Project-Level ────────────────────────────────────────────┐
│                                                            │
│  ./project/.claude/agents/ (project-specific agents)      │
│  ./project/.opencode/agent/ (OpenCode project agents)     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Current Components

1. **Claude Agents** (`~/.claude/agents/`)
   - 14 global agents: technical-writer, backend-architect, etc.
   - Format: Claude YAML frontmatter without `model` field
   - Managed in `/Users/smian/dotfiles/claude/.claude/agents/`

2. **OpenCode Agents** (`~/.config/opencode/agent/`)
   - 4 OpenCode-specific agents: helper, markdown-pro, news, review
   - Format: OpenCode YAML frontmatter with required `model` field
   - Managed in `/Users/smian/dotfiles/opencode/.config/opencode/agent/`

3. **Transformation Plugin** (`~/.config/opencode/plugin/`)
   - On-the-fly transformation for tool calls
   - Located in `/Users/smian/dotfiles/opencode/.config/opencode/plugin/`

## Problem Statement

### Primary Issues

1. **Agent Loading Mechanism**
   - OpenCode loads agents directly from filesystem at startup
   - Plugin hooks don't intercept agent loading
   - `undefined is not an object (evaluating 'agent.model')` error

2. **Format Incompatibility**
   - Claude agents lack required `model` field
   - Different YAML frontmatter expectations

3. **Duplication of Configuration**
   - Separate agent directories for Claude and OpenCode
   - No single source of truth for agent definitions

### User Experience Goals

- All 14 global Claude agents available in OpenCode
- All 4 OpenCode agents remain functional
- Project-local agents override global agents
- Zero duplication of agent definitions
- Single dotfiles management approach

## Architecture Options

### Option 1: Filesystem Bridge with Preprocessing

**Approach:** Create transformed agent files in OpenCode's expected location

```
dotfiles/claude/.claude/agents/              (Source of truth)
         ↓ [transformation script]
dotfiles/opencode/.config/opencode/agent/claude/  (Generated)
```

**Pros:**
- OpenCode reads agents directly without errors
- Maintains single source of truth in Claude directory
- No runtime transformation needed

**Cons:**
- Requires build step / generation script
- File synchronization complexity
- Potential for stale transformed files

### Option 2: Symlink with Transformation Layer

**Approach:** Symlink Claude agents and intercept at runtime

```
dotfiles/opencode/.config/opencode/agent/claude/ → dotfiles/claude/.claude/agents/
+ Runtime transformation via plugin hooks
```

**Pros:**
- Direct file linking
- Real-time updates from source

**Cons:**
- Plugin doesn't intercept agent loading
- OpenCode expects specific format at load time

### Option 3: Unified Agent Directory (Recommended)

**Approach:** Make OpenCode agent directory reference Claude agents with preprocessing

```
dotfiles/claude/.claude/agents/               (Source: Claude agents)
dotfiles/opencode/.config/opencode/agent/     (Source: OpenCode-specific agents)
         ↓ [transformation]
~/.config/opencode/agent/                     (Unified view)
```

**Implementation:**
1. Transform Claude agents → OpenCode format
2. Place in staging directory
3. Link both OpenCode-native and transformed Claude agents
4. Result: unified agent directory with all agents

## Recommended Solution: Option 3

### Architecture Design

```
┌─ Source Directories ────────────────────────────────────────┐
│                                                             │
│  dotfiles/claude/.claude/agents/                           │
│  ├── technical-writer.md (Claude format)                   │
│  ├── backend-architect.md                                  │
│  └── ... (14 total)                                        │
│                                                             │
│  dotfiles/opencode/.config/opencode/agent/                 │
│  ├── helper.md (OpenCode format)                           │
│  ├── markdown-pro.md                                       │
│  └── ... (4 total)                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─ Transformation Pipeline ───────────────────────────────────┐
│                                                             │
│  1. Transform Claude agents → OpenCode format              │
│  2. Add required 'model: inherit' field                    │
│  3. Clean description formatting                           │
│  4. Place in staging directory                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─ Unified Result ────────────────────────────────────────────┐
│                                                             │
│  ~/.config/opencode/agent/ (via symlinks)                   │
│  ├── technical-writer.md (transformed)                     │
│  ├── backend-architect.md (transformed)                    │
│  ├── ... (14 Claude agents)                                │
│  ├── helper.md (native OpenCode)                           │
│  ├── markdown-pro.md (native)                              │
│  └── ... (4 OpenCode agents)                               │
│                                                             │
│  Total: 18 agents available in OpenCode                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Design

#### 1. Transformation Script (`transform-claude-agents.js`)

```javascript
// Read Claude agents from dotfiles/claude/.claude/agents/
// Transform frontmatter: add model field, clean description
// Write to dotfiles/opencode/.config/opencode/agent/claude/
```

#### 2. Stow Configuration

```
dotfiles/
├── claude/.claude/agents/          (source)
└── opencode/.config/opencode/
    ├── agent/                      (native OpenCode agents)
    └── agent-claude/               (transformed Claude agents)
```

#### 3. Runtime Plugin (Enhanced)

- Handle any dynamic agent requests
- Provide debugging capabilities
- Fallback transformation if needed

### Implementation Plan

#### Phase 1: Transformation Pipeline
1. Create `transform-claude-agents.js` script
2. Transform all Claude agents → OpenCode format
3. Place in `dotfiles/opencode/.config/opencode/agent-claude/`

#### Phase 2: Directory Linking  
1. Configure symlinks to link both agent directories
2. Test unified agent availability
3. Verify all 18 agents load correctly

#### Phase 3: Automation
1. Add transformation to dotfiles update script
2. Create watch script for auto-regeneration
3. Document maintenance procedures

#### Phase 4: Plugin Cleanup
1. Remove debug logging
2. Simplify plugin to handle edge cases only
3. Update documentation

## File Structure

### Before (Current)
```
dotfiles/
├── claude/.claude/agents/              (14 Claude agents)
└── opencode/.config/opencode/agent/    (4 OpenCode agents)

~/.config/opencode/agent/               (4 agents only)
```

### After (Proposed)
```
dotfiles/
├── claude/.claude/agents/              (14 Claude agents - source)
└── opencode/.config/opencode/
    ├── agent/                          (4 OpenCode agents)
    └── agent-claude/                   (14 transformed agents)

~/.config/opencode/agent/               (18 agents total)
```

## Trade-offs and Considerations

### Pros
- ✅ Single source of truth in Claude directory
- ✅ All agents available in OpenCode
- ✅ No runtime transformation errors
- ✅ Maintains dotfiles management approach
- ✅ Project-local override capability preserved

### Cons
- ⚠️ Requires transformation step
- ⚠️ Potential for sync lag between source and transformed
- ⚠️ Additional complexity in dotfiles setup

### Risk Mitigation
- Automated transformation script
- Git tracking of transformed files
- Clear documentation for maintenance
- Fallback to runtime transformation if needed

## Success Criteria

1. **Functional Requirements**
   - All 14 Claude global agents available in OpenCode
   - All 4 OpenCode agents remain functional
   - `opencode run --agent <any-agent>` works without errors
   - Project-local agents override global agents

2. **Operational Requirements**
   - Single command to regenerate transformed agents
   - Clear error messages if transformation fails
   - Documentation for troubleshooting

3. **Maintenance Requirements**
   - Changes to Claude agents automatically propagate
   - No manual file copying required
   - Integration with existing dotfiles workflow

## Next Steps

1. Review and iterate on this design
2. Implement transformation script
3. Test with subset of agents
4. Full rollout and documentation
5. Plugin simplification and cleanup

---

*This design document should be reviewed and refined before implementation.*