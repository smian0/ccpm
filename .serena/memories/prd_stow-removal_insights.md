{
  "feature_name": "stow-removal",
  "problem_statement": "Remove redundant stowing mechanism since OpenCode is now global, eliminating unnecessary complexity",
  "target_users": ["CCPM developers", "project maintainers", "new users setting up CCPM"],
  "success_criteria": [".stow/ directory removed", "no stow references in scripts", "all PM commands function normally"],
  "technical_constraints": ["must not break core CCPM functionality", "atomic change", "clean removal"],
  "dependencies": ["none - pure cleanup task"],
  "created_date": "2025-09-17T00:04:32Z",
  "scope": "cleanup/simplification",
  "impact": "reduces technical debt and project complexity"
}