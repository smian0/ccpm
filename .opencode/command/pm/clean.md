---
description: Clean command - archive completed work and maintain project organization
agent: build
---

# Clean

Clean up completed work and archive old epics.

## Usage
```
/pm:clean [--dry-run]
```

Options:
- `--dry-run` - Show what would be cleaned without doing it

## Instructions

### 1. Identify Completed Epics

Find epics with:
- `status: completed` in frontmatter
- All tasks closed
- Last update > 30 days ago

### 2. Identify Stale Work

Find:
- Progress files for closed issues
- Update directories for completed work
- Orphaned task files (epic deleted)
- Empty directories

### 3. Show Cleanup Plan

```
🧹 Cleanup Plan

Completed Epics to Archive:
  {epic_name} - Completed {days} days ago
  {epic_name} - Completed {days} days ago
  
Stale Progress to Remove:
  {count} progress files for closed issues
  
Empty Directories:
  {list_of_empty_dirs}
  
Space to Recover: ~{size}KB

{If --dry-run}: This is a dry run. No changes made.
{Otherwise}: Proceed with cleanup? (yes/no)
```

### 4. Execute Cleanup

If user confirms:

**Archive Epics:**
```bash
mkdir -p .opencode/epics/.archived
mv .opencode/epics/{completed_epic} .opencode/epics/.archived/
```

**Remove Stale Files:**
- Delete progress files for closed issues > 30 days
- Remove empty update directories
- Clean up orphaned files

**Create Archive Log:**
Create `.opencode/epics/.archived/archive-log.md`:
```markdown
# Archive Log

## {current_date}
- Archived: {epic_name} (completed {date})
- Removed: {count} stale progress files
- Cleaned: {count} empty directories
```

### 5. Output

```
✅ Cleanup Complete

Archived:
  {count} completed epics
  
Removed:
  {count} stale files
  {count} empty directories
  
Space recovered: {size}KB

System is clean and organized.
```

## Important Notes

Always offer --dry-run to preview changes.
Never delete PRDs or incomplete work.
Keep archive log for history.