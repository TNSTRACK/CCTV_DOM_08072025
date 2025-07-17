# DOM CCTV MVP - Professional Development Workflow

## 🚀 Session Initialization Protocol

### ❓ Startup Questions
**IMPORTANT**: At the beginning of each Claude Code session, ask:

1. **"¿Vas a realizar cambios en el código durante esta sesión?"**
   - If **YES**: Continue with branch analysis and setup
   - If **NO**: Skip git workflow and continue with current branch

2. **If YES to coding changes**: Perform project state analysis:
   - Check current branch status with `git branch -v`
   - Review recent commits in dev with `git log dev --oneline -10`
   - Analyze pending changes with `git status`
   - Check for conflicts with `git diff dev`

3. **Branch Creation Decision**:
   - If in dev branch: Create new feature branch
   - If in existing feature branch: Ask to continue or create new branch
   - If in master: **ERROR** - Never work directly in master

### 🔧 Feature Branch Setup Process
```bash
# Standard branch creation from dev
git checkout dev
git pull origin dev
git checkout -b <branch-type>/<descriptive-name>
```

#### Branch Type Selection Guide:
- `feature/` - New functionality
- `bugfix/` - Bug fixes  
- `hotfix/` - Critical production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions
- `chore/` - Maintenance tasks

### 📋 Project State Analysis Template
Show user:
```
🔍 PROJECT STATE ANALYSIS
├── Current Branch: [branch-name]
├── Recent Commits in dev: [last-3-commits]
├── Modified Files: [count]
├── Untracked Files: [count]
├── Conflicts: [yes/no]
└── Suggested Branch: [type/name]
```

---

## Project Instructions for Node.js & React
🔄 Project Awareness & Context

Always read PLANNING.md at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
Check TASK.md before starting a new task. If the task isn’t listed, add it with a brief description and today's date (July 08, 2025).
Use consistent naming conventions, file structure, and architecture patterns as described in PLANNING.md.
Use Node.js environment (via nvm or specified Node version in .nvmrc) for executing JavaScript commands, including for unit tests.

🧱 Code Structure & Modularity

Never create a file longer than 500 lines of code. If a file approaches this limit, refactor by splitting it into components, hooks, or utility files.
Organize code into clearly separated modules, grouped by feature or responsibility. For a React project, this looks like:
components/ - Reusable UI components
hooks/ - Custom React hooks
services/ - API calls and external service logic
utils/ - Utility functions
context/ - React context for state management


Use clear, consistent imports (prefer ES modules with import over CommonJS require).
Use .env files with dotenv for environment variables. Load them using dotenv in Node.js or rely on React's built-in process.env for client-side variables prefixed with REACT_APP_.

🧪 Testing & Reliability

Always create Jest unit tests for new features (components, hooks, utilities, API services, etc.).
After updating any logic, check whether existing unit tests need to be updated. If so, do it.
Tests should live in a __tests__ folder or colocated with source files (e.g., Component.test.js).
Include at least:
1 test for expected use
1 edge case
1 failure case




Use @testing-library/react for React component testing and msw for mocking API calls.

✅ Task Completion

Mark completed tasks in TASK.md immediately after finishing them.
Add new sub-tasks or TODOs discovered during development to TASK.md under a “Discovered During Work” section.

📎 Style & Conventions

Use JavaScript/TypeScript as the primary language(s). Prefer TypeScript for type safety unless specified otherwise.
Follow ESLint and Prettier for code formatting and Airbnb JavaScript style guide for conventions.
Use PropTypes or TypeScript interfaces for component prop validation.
Use axios or fetch for API calls. For state management, prefer React Context or lightweight libraries like Zustand unless specified.
Write JSDoc comments for every function or component using the following style:/**
 * Brief summary.
 *
 * @param {type} param1 - Description.
 * @returns {type} Description.
 */
function example(param1) {
  // Logic here
}


For React components:/**
 * Component description.
 *
 * @param {Object} props - Component props.
 * @param {type} props.param1 - Description.
 * @returns {JSX.Element} Rendered component.
 */
function MyComponent({ param1 }) {
  return <div>{param1}</div>;
}



📚 Documentation & Explainability

Update README.md when new features are added, dependencies change, or setup steps are modified.
Comment non-obvious code and ensure everything is understandable to a mid-level developer.
When writing complex logic, add an inline // Reason: comment explaining the why, not just the what.

🧠 AI Behavior Rules

Never assume missing context. Ask questions if uncertain.
Never hallucinate libraries or functions – only use known, verified Node.js/React packages.
Always confirm file paths and module names exist before referencing them in code or tests.
Never delete or overwrite existing code unless explicitly instructed to or if part of a task from TASK.md.
