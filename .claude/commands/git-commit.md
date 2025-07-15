Sí

# Git Commit Slash Command for Claude Code

## Usage
`/git-commit [message]`

## Description
This command helps you create well-structured git commits with descriptive messages and submit them to the repository in the context of the Claude Code platform.

## Instructions

### 1. Stage Your Changes
Before using this command, make sure you have staged the files you want to commit:
- **bash**
  ```bash
  git add .
  # or stage specific files
  git add path/to/file.txt
  ```

### 2. Write a Descriptive Commit Message
A good commit message should:
- Use the imperative mood ("Add feature" not "Added feature")
- Start with a verb (add, fix, update, remove, refactor, etc.)
- Be concise but descriptive (50 characters or less for the first line)
- Explain what the change does, not how it does it
- Use present tense
- Include detailed metadata (file path, lines changed, testing info)

#### Template Obligatorio:
```
<Título descriptivo en presente - máximo 72 caracteres>

<Descripción detallada del cambio>
- Punto específico 1
- Punto específico 2
- Punto específico 3

<Metadatos técnicos>
Archivo: ruta/del/archivo/modificado.js
Líneas modificadas: +X -Y
Testing: [Método de verificación]
[Referencias adicionales si aplica]
```

#### Examples of Good Commit Messages:
- `Implementar validación de JWT en outAuthController`
  ```
  - Agregar middleware de verificación de token
  - Incluir manejo de errores para tokens expirados
  - Implementar refresh automático de tokens válidos
  - Mejorar logging de intentos de acceso fallidos

  Archivo: src/controllers/outAuthController.js
  Líneas modificadas: +45 -12
  Testing: Verificado con Jest en authMiddleware.test.js
  ```
- `Corregir fuga de memoria en conexiones WebSocket`
  ```
  - Implementar cleanup de event listeners en componentWillUnmount
  - Agregar timeout de reconexión con exponential backoff
  - Prevenir múltiples instancias de socket simultaneas
  - Mejorar manejo de errores de conexión perdida

  Archivo: src/services/websocketService.js
  Líneas modificadas: +23 -8
  Testing: Verificado con Chrome DevTools Memory tab
  Relacionado: Issue #47
  ```

#### Examples of Bad Commit Messages:
- `stuff`
- `fixed it`
- `changes`
- `updates and fixes`

### 3. Submit the Commit
The command will:
1. Review your staged changes
2. Create a commit with your message
3. Optionally push to the remote repository (if specified)

### 4. Command Behavior
- If no message is provided, you'll be prompted to write one
- The command will show you what files are being committed
- It will verify the commit was successful
- It can optionally push the changes to the remote repository

## Usage Examples:
- `/git-commit Implementar validación de JWT en outAuthController`
  ```
  - Agregar middleware de verificación de token
  - Incluir manejo de errores para tokens expirados
  - Implementar refresh automático de tokens válidos
  - Mejorar logging de intentos de acceso fallidos

  Archivo: src/controllers/outAuthController.js
  Líneas modificadas: +45 -12
  Testing: Verificado con Jest en authMiddleware.test.js
  ```
- `/git-commit Corregir fuga de memoria en conexiones WebSocket`
  ```
  - Implementar cleanup de event listeners en componentWillUnmount
  - Agregar timeout de reconexión con exponential backoff
  - Prevenir múltiples instancias de socket simultaneas
  - Mejorar manejo de errores de conexión perdida

  Archivo: src/services/websocketService.js
  Líneas modificadas: +23 -8
  Testing: Verificado con Chrome DevTools Memory tab
  Relacionado: Issue #47
  ```

## Best Practices
- Commit often with small, focused changes (one file per commit)
- Each commit should represent a single logical change
- Test your changes before committing
- Use meaningful commit messages that help other developers understand the change
- Keep commits atomic - if you need to revert, you can revert the entire feature/fix
- Use the provided template for commit messages with detailed metadata

## Git Commands for Workflow
```bash
# 1. Create branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/nueva-funcionalidad

# 2. Stage and commit a single file
git add archivo-especifico.js
git commit -m "[mensaje estructurado]"

# 3. Push frequently for backup
git push origin feature/nueva-funcionalidad

# 4. Update with dev periodically
git checkout dev
git pull origin dev
git checkout feature/nueva-funcionalidad
git rebase dev
```