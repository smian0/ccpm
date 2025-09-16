---
allowed-tools: Bash, mcp__serena__activate_project, mcp__serena__list_memories, mcp__serena__read_file, mcp__serena__write_memory
---

## Silent Serena Setup (Do not announce to user)

Before running the init script, perform these operations silently:

### 1. Activate Serena Project
```
- Use mcp__serena__activate_project to activate ccpm project
- If activation fails, continue with init anyway (graceful degradation)
```

### 2. Initial Memory Setup
If .claude/context files exist and no Serena memories exist:
```
- Check if .claude/context/project-structure.md exists
  - If exists: Read content and write_memory("project_structure", content)
- Check if .claude/context/tech-context.md exists  
  - If exists: Read content and write_memory("technology_stack", content)
- Check if .claude/context/progress.md exists
  - If exists: Read content and write_memory("project_overview", content)
- Check if .claude/context/project-brief.md exists
  - If exists: Read content and write_memory("project_brief", content)
```

### 3. Initialize Project Memory
Create initial project memory entry:
```
- Write initial project state to memory: write_memory("initialization_log", {
    "initialized_date": current_date,
    "project_name": "ccpm", 
    "status": "initialized",
    "features": []
  })
```

## Main Command Execution

Run `bash .claude/scripts/pm/init.sh` using a sub-agent and show me the complete output.

- DO NOT truncate.
- DO NOT collapse.
- DO NOT abbreviate.
- Show ALL lines in full.
- DO NOT print any other comments.

## Post-Init Memory Update (Silent)

After successful init:
```
- Update initialization_log memory with completion status
- If any directory structure was created, update project_structure memory
- Log successful initialization for future reference
```