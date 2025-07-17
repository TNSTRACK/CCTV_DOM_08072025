# Git Commit Slash Command for Claude Code - Professional Workflow

## Usage
`/git-commit`

## Description
This command implements a professional git workflow with individual file commits, proper branching strategy, and merge management for production-ready code.

## Professional Workflow Process

### 1. Pre-Commit Analysis
Before executing commits, Claude Code will:
- Analyze all modified and new files
- Check current branch status 
- Verify we're working in a feature branch (not dev/master)
- Review git history to understand recent changes

### 2. Individual File Commits
The command will commit files **one by one** with individual descriptions:
- Each file gets its own commit with specific changes
- Detailed analysis of what changed in that specific file
- Proper commit message following international standards
- Atomic commits for better git history

### 3. Branch Naming Standards (International Best Practices)
When creating branches, use these prefixes:
- `feature/` - New functionality (e.g., `feature/multi-camera-events`)
- `bugfix/` - Bug fixes (e.g., `bugfix/video-player-error`)
- `hotfix/` - Critical production fixes (e.g., `hotfix/security-patch`)
- `refactor/` - Code refactoring (e.g., `refactor/cleanup-components`)
- `docs/` - Documentation updates (e.g., `docs/api-documentation`)
- `test/` - Test additions (e.g., `test/unit-tests-events`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 4. Commit Message Template (Per File)
```
<type>(<scope>): <subject>

<body>
- Specific change 1 in this file
- Specific change 2 in this file
- Specific change 3 in this file

File: path/to/file.extension
Lines: +X -Y
Testing: [Verification method]
Related: [Issue/PR references if applicable]
```

### 5. Post-Commit Workflow Decision
After all files are committed, Claude Code will ask:

**"¿Quieres realizar un merge con la rama dev o continuar trabajando en esta rama?"**

#### Option A: Merge to dev (Feature Complete)
- Executes: `git checkout dev && git pull origin dev`
- Merges with: `git merge --no-ff <feature-branch> -m "Merge: <descriptive-message>"`
- Pushes: `git push origin dev`
- Cleans up: `git branch -d <feature-branch>`

#### Option B: Continue Working
- Adds session progress note to last commit
- Pushes current branch: `git push origin <current-branch>`
- Continues in same branch for next session

### 6. Master Branch Deployment (Double Confirmation)
When ready to deploy to master:
1. **First confirmation**: "¿Estás seguro de que quieres publicar en master?"
2. **Second confirmation**: "Esta acción desplegará a producción. ¿Confirmas?"
3. **Version tagging**: Auto-generates semantic version (MAJOR.MINOR.PATCH)
4. **Deployment**: Merges to master with version tag

## Session Initialization Protocol

### Startup Questions
When starting a new Claude Code session:
1. "¿Vas a realizar cambios en el código durante esta sesión?"
2. If YES: Check project state and create appropriate branch
3. If NO: Continue with current branch status

### Project State Analysis
- Check current branch status
- Review recent commits in dev
- Analyze pending changes or conflicts
- Suggest appropriate branch name for new work

## Commands Implementation

### Individual File Commit Process
```bash
# For each modified file:
git add <specific-file>
git commit -m "<structured-message-for-this-file>"

# After all files:
# Ask for merge decision
# Execute chosen workflow
```

## Command Execution Steps

When `/git-commit` is executed, Claude Code will:

1. **Analyze Repository State**
   ```bash
   git status --porcelain
   git branch --show-current
   git log --oneline -5
   ```

2. **Process Each File Individually**
   For each modified file, execute sequentially:
   ```bash
   # Analyze changes in this specific file
   git diff --stat <file-path>
   git diff <file-path>
   
   # Stage and commit this file only
   git add <file-path>
   git commit -m "$(cat <<'EOF'
   <type>(<scope>): <subject>
   
   <body>
   - Change 1 in this file
   - Change 2 in this file
   - Change 3 in this file
   
   File: <file-path>
   Lines: +X -Y
   Testing: <verification-method>
   Related: <references-if-applicable>
   
   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   EOF
   )"
   ```

3. **Post-Commit Decision**
   Ask user: "¿Quieres realizar un merge con la rama dev o continuar trabajando en esta rama?"
   
   Execute chosen workflow based on user response.

### Branch Management
```bash
# Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/descriptive-name

# Merge back to dev (when feature complete)
git checkout dev
git pull origin dev
git merge --no-ff feature/descriptive-name -m "Merge: Complete feature description"
git push origin dev
git branch -d feature/descriptive-name
```

### Version Management
```bash
# Generate semantic version
git tag -a v1.2.3 -m "Version 1.2.3: Feature description"
git push origin v1.2.3
```

## Best Practices Enforcement

### Commit Standards
- One file per commit when possible
- Descriptive commit messages with impact analysis
- Proper scoping and categorization
- Testing verification for each change

### Branch Protection
- Never commit directly to master
- Always work in feature branches
- Require pull requests for dev → master
- Maintain clean git history with --no-ff merges

### Quality Assurance
- Pre-commit hooks for code quality
- Automated testing before merge
- Code review process simulation
- Documentation updates tracking

## Error Handling and Recovery
- Detect merge conflicts and guide resolution
- Rollback procedures for failed deployments
- Branch recovery for interrupted sessions
- Automated cleanup of stale branches

## Integration with Development Workflow
- Connects with existing project structure
- Maintains compatibility with current tools
- Provides guidance for team collaboration
- Ensures production readiness standards

---

**Note**: This workflow ensures professional development standards while maintaining code quality and deployment safety through proper branching, atomic commits, and controlled merges.