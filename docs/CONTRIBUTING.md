# Contributing to LLM Prompt Builder

Thank you for your interest in contributing to LLM Prompt Builder! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Running Tests](#running-tests)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Branch Strategy](#branch-strategy)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Adding Features](#adding-features)
- [Reporting Issues](#reporting-issues)

## Getting Started

### Fork the Repository

1. Visit the [repository](https://github.com/benjaminjamesxyz/llm-prompt-builder)
2. Click the "Fork" button in the top-right corner
3. This creates a copy under your GitHub account

### Clone Your Fork

```bash
# Clone your fork
git clone https://github.com/your-username/llm-prompt-builder.git

# Navigate into project directory
cd llm-prompt-builder

# Add original repository as remote (called "upstream")
git remote add upstream https://github.com/benjaminjamesxyz/llm-prompt-builder.git
```

### Install Dependencies

```bash
bun install
```

### Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Workflow

### Create a Feature Branch

```bash
# Ensure you're on master and up-to-date
git checkout master
git pull upstream master

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Conventions

- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring

### Make Your Changes

1. **Implement your changes** in the codebase
2. **Test locally** using `bun run test`
3. **Type check** using `bun typecheck`
4. **Commit changes** with clear messages (see [Commit Guidelines](#commit-guidelines))

### Keep Your Branch Up-to-Date

```bash
# Regularly sync with upstream
git fetch upstream
git rebase upstream/master

# Or use merge
git fetch upstream
git merge upstream/master
```

## Running Tests

### Run All Tests

```bash
# Run tests in watch mode (automatically re-runs on changes)
bun run test
```

### Run Tests Once (CI Mode)

```bash
# Run tests once (useful before committing)
bun run test:ci
```

### Run Tests with Coverage

```bash
# Generate coverage report
bun run test:coverage
```

Coverage report is generated in `coverage/` directory.

### Test Framework

This project uses:
- **Vitest** - Fast unit test framework
- **jsdom** - DOM environment for testing
- **@testing-library/preact** - Component testing utilities

### Test Structure

```
src/utils/validation.test.ts  # Tests for validation utilities
src/utils/formatters.test.ts  # Tests for formatters
...
```

### Writing Tests

1. **Test files** should be co-located with source files
2. **Naming:** `filename.test.ts` for `filename.ts`
3. **Use `describe` blocks** to group related tests
4. **Use `it` for individual test cases**
5. **Write descriptive test names:** "should format simple node correctly"

Example:

```typescript
import { describe, it, expect } from 'vitest';
import { formatNode } from './formatters';

describe('formatters', () => {
  it('should format simple node correctly', () => {
    const node = { id: '1', tag: 'TEST', content: 'Hello' };
    const result = formatNode(node, 'json');
    expect(result).toContain('"tag": "TEST"');
  });

  it('should handle nested children', () => {
    // test implementation
  });
});
```

## Code Style Guidelines

### TypeScript

This project uses **strict TypeScript mode** with the following enabled:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

#### Type Definitions

- Use `interface` for object shapes that may be used at runtime
- Use `type` for unions, aliases, and utility types
- Always type function parameters and return values

```typescript
// Good: Interface for runtime use
interface Node {
  id: string;
  tag: string;
  content: string;
}

// Good: Type for union
type Format = 'xml' | 'json' | 'yaml' | 'toon' | 'md';

// Good: Type for utility function
type Formatter = (nodes: Node[]) => string;

// Bad: Using `any`
const processNode = (node: any) => { /* ... */ };

// Good: Use `unknown` or proper types
const processNode = (node: unknown) => { /* ... */ };
```

#### Generics

Use generics when appropriate:

```typescript
// Good: Generic function
function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// Usage
interface User { name: string; age: number; }
const user = safeJsonParse<User>('{"name":"John", "age":30}');
```

### Imports

Group imports by type:

1. **Third-party libraries**
2. **Internal modules**

```typescript
// Correct order:
import init from '../wasm-pkg/llm_prompt_builder_wasm';
import { useState, useEffect } from 'preact/hooks';
import { Button } from './components/Button';
import { Node, ModelConfig } from '../types';
```

### Components

#### Functional Components Only

Use functional components with hooks exclusively (no class components except ErrorBoundary):

```typescript
// Good: Functional component with hooks
interface ButtonProps {
  onClick: () => void;
  children: any;
  variant?: ButtonVariant;
}

export const Button = ({ onClick, children, variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  );
};

// Avoid: Class components
class Button extends Component { /* ... */ }
```

#### Props Interface

Define props interface above component:

```typescript
interface BlockProps {
  node: Node;
  updateNode: (id: string, changes: Partial<Node>) => void;
  deleteNode: (id: string) => void;
}

export const Block = ({ node, updateNode, deleteNode }: BlockProps) => {
  // component logic
};
```

#### Default Props

Use parameter destructuring for defaults:

```typescript
// Good: Default in destructuring
export const Button = ({ onClick, children, variant = 'primary' }: ButtonProps) => {
  // ...
};

// Avoid: Explicit checks
export const Button = (props: ButtonProps) => {
  const variant = props.variant || 'primary';
  // ...
};
```

### Naming Conventions

- **Components:** PascalCase (`Button`, `BlockPicker`, `SimpleItem`)
- **Functions/Variables:** camelCase (`saveToLocalStorage`, `validateNodes`, `formatNode`)
- **Constants/Enums:** UPPER_SNAKE_CASE (`MAX_FILE_SIZE_BYTES`, `ValidationError`, `THEME_DRACULA`)
- **Types/Interfaces:** PascalCase, descriptive (`Node`, `ModelConfig`, `BlockDef`)
- **File Names:** kebab-case (`button.tsx`, `block-picker.tsx`)

### Error Handling

Always use try-catch for async operations and external dependencies:

```typescript
// Good: Try-catch with typed error handling
export const safeJsonParse = <T,>(json: string): { data: T | null; error: string | null } => {
  try {
    return { data: JSON.parse(json) as T, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Unknown error' };
  }
};

// Good: Return error objects with typed codes
export const validateFileSize = (file: File): { valid: boolean; error?: ValidationError } => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: ValidationError.FILE_TOO_LARGE };
  }
  return { valid: true };
};
```

### Accessibility

**All interactive elements must have accessibility attributes:**

#### ARIA Labels

```tsx
// Good: Button with aria-label
<Button onClick={handleClick} aria-label="Add new block">
  <Plus />
</Button>

// Good: Input with aria-label
<input
  type="text"
  value={value}
  onChange={(e) => handleChange(e.currentTarget.value)}
  aria-label="Prompt content"
/>

// Good: Toggle button with aria-pressed
<button
  onClick={toggleMenu}
  aria-pressed={isOpen ? 'true' : 'false'}
  aria-label="Toggle block menu"
>
  <MenuIcon />
</button>
```

#### Semantic HTML

```tsx
// Good: Semantic elements
<header>
  <h1>LLM Prompt Builder</h1>
</header>

<main>
  <section aria-label="Builder section">
    <h2>Builder</h2>
  </section>
</main>

<footer>
  <p>© 2024 LLM Prompt Builder</p>
</footer>
```

#### Error Messages

Use `role="alert"` and `aria-live="polite"` for error messages:

```tsx
{error && (
  <div role="alert" aria-live="polite" className="error-message">
    {error}
  </div>
)}
```

### Security

- **Always sanitize user input** before rendering HTML
- **Validate file uploads** with size limits and schema validation
- **Use safe JSON parsing** to prevent injection
- **Never use `dangerouslySetInnerHTML`** without DOMPurify sanitization

```typescript
// Good: Sanitize before rendering
import DOMPurify from 'dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);

// Good: Safe JSON parsing
const data = safeJsonParse<User>(jsonString);

// Bad: Never do this
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## Commit Guidelines

### Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (dependencies, build config)

### Examples

```
feat: add Tree of Thought prompting blocks

Add Tree of Thought (ToT) prompting technique blocks to all
text-based models. ToT enables AI models to systematically explore
multiple solution paths and evaluate each branch before selecting
optimal solution.

Added 5 new ToT blocks:
- TOT_PROBLEM: Define core problem statement
- TOT_BRANCH: Represent different thought paths/solution branches
- TOT_THOUGHT: Individual thought step within a branch
- TOT_EVALUATION: Evaluate branch quality with pros and cons
- TOT_SOLUTION: Best solution chosen after evaluation

Updated 8 text-based models:
- generic, gemini, claude, openai, llama, deepseek, qwen, glm

Added 9 comprehensive ToT examples:
- Generic model: Basic ToT and embedded systems timing issue
- Other models: Model-specific ToT examples adapted to their format
```

```
fix: prevent XSS attacks in prompt output

Sanitize user input before rendering HTML using DOMPurify.
Also validate tag inputs to prevent HTML injection attempts.
```

### Guidelines

- **Subject line:** 50 characters or less
- **Use imperative mood:** "Add" not "Added", "Fix" not "Fixed"
- **Don't end with period:** Subject should be concise
- **Body:** Explain what and why, not how
- **Reference issues:** Closes #123, Fixes #456

## Branch Strategy

### Feature Branches

Create branches from `master`:

```bash
git checkout master
git pull upstream master
git checkout -b feature/your-feature-name
```

### Pull Requests

- **Target branch:** `master`
- **Branch from:** `master`
- **Title:** Descriptive, using same format as commits
- **Description:** Explain changes, reference related issues

### Before Submitting PR

1. **All tests must pass:** Run `bun run test:ci`
2. **Type checking must succeed:** Run `bun typecheck`
3. **Code follows style guidelines:** Review sections above
4. **Documentation updated:** If applicable
5. **No console errors:** Check browser console during manual testing

### After PR Submission

1. **CI/CD runs automatically** on your PR
   - Typecheck step
   - Test step
   - Build step
   - Preview deployment

2. **Wait for code review** from maintainers
3. **Address feedback** in new commits (not amend)
4. **Update PR description** if scope changes

## Testing Requirements

### Before Committing

```bash
# Run type checking
bun typecheck

# Run tests
bun test:ci

# Build to ensure no build errors
bun run build
```

### CI/CD Requirements

All Pull Requests must have:

- ✅ **Typecheck passed** - No TypeScript errors
- ✅ **Tests passed** - All tests passing
- ✅ **Build succeeded** - No build errors

### Manual Testing Checklist

Before submitting PR, manually test:

- [ ] Feature works as expected in browser
- [ ] No console errors or warnings
- [ ] Accessible (keyboard navigation, screen reader)
- [ ] Works across supported browsers (Chrome, Firefox, Safari)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Export formats work (XML, JSON, YAML, TOON, MD)
- [ ] Theme switching works (all themes)
- [ ] LocalStorage save/load works

## Pull Request Process

### 1. Open a Pull Request

1. Push your feature branch to your fork
2. Visit your fork on GitHub
3. Click "New Pull Request"
4. Select your branch vs `master` branch
5. Fill in PR template (description, linked issues, etc.)

### 2. PR Template

When opening a PR, include:

**Description:**
- Brief summary of changes
- Motivation (why this change)
- How it solves the problem

**Testing:**
- How you tested the changes
- Manual testing performed
- Screenshots if UI changes

**Related Issues:**
- Link to related GitHub issues
- "Fixes #123" or "Closes #456"

### 3. Code Review

Maintainers will review your PR for:
- Code quality and style
- Test coverage
- Breaking changes
- Documentation updates

### 4. Address Feedback

- Make requested changes in new commits
- Push to your PR branch
- PR updates automatically with new commits
- Don't use `git commit --amend` (rewrites history)

### 5. Merge

Once approved:
- Maintainer merges to `master`
- CI/CD automatically deploys to production
- Delete your feature branch (optional)

## Adding Features

### Adding New Blocks

1. Add block definition to `src/data/blockDefs.ts`:

```typescript
export const BLOCK_DEFS: BlockDefs = {
  // ... existing blocks
  your_block: {
    tag: "YOUR_BLOCK",
    content: "Default content...",
    desc: "Block description"
  }
};
```

2. Add block to model(s) in `src/data/models.ts`:

```typescript
export const MODELS: ModelConfigs = {
  your_model: {
    name: "Your Model",
    blocks: ["your_block", /* other blocks */]
  }
};
```

3. Test block appears in BlockPicker

See [docs/ADDING_EXAMPLES.md](ADDING_EXAMPLES.md) for detailed guidance.

### Adding New Models

1. Add model key to `src/types/index.ts`:

```typescript
export type ModelKey = keyof ModelConfigs;

export interface ModelConfigs {
  // ... existing models
  your_new_model: ModelConfig;
}
```

2. Define model in `src/data/models.ts`:

```typescript
export const MODELS: ModelConfigs = {
  your_new_model: {
    name: "Your Model Name",
    blocks: ["block1", "block2", /* ... */]
  }
};
```

3. Add example prompts in `src/data/examples.ts`

4. Test model appears in dropdown and examples load

See [docs/ADDING_EXAMPLES.md](ADDING_EXAMPLES.md) for comprehensive guide.

### Adding Examples

For adding example prompts and templates, see the comprehensive guide:

**[docs/ADDING_EXAMPLES.md](ADDING_EXAMPLES.md)**

Covers:
- Understanding data structure
- Creating new example prompts
- Block categories and patterns
- Best practices
- Example walkthroughs
- Testing examples

### Adding Components

1. Create component in `src/components/YourComponent.tsx`
2. Export from `src/components/index.ts`:

```typescript
export { YourComponent } from './YourComponent';
```

3. Use component in `App.tsx` or other components

4. Add tests in `src/components/YourComponent.test.tsx`

### Adding Utilities

1. Create utility in `src/utils/yourUtility.ts`
2. Export from `src/utils/index.ts`:

```typescript
export { yourUtility } from './yourUtility';
```

3. Add tests in `src/utils/yourUtility.test.ts`

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Clear title:** "TypeError when exporting to YAML"
2. **Description:** What happened and what you expected
3. **Steps to reproduce:**
   ```bash
   1. Open app
   2. Select "Generic" model
   3. Click "Add Block"
   4. Add "ROLE" block
   5. Click "Export" → "YAML"
   6. Error occurs
   ```
4. **Environment:**
   - Browser: Chrome 120
   - OS: macOS 14
   - Device: Desktop
5. **Screenshots:** If UI-related
6. **Console errors:** Copy from browser console

### Feature Requests

When suggesting features:

1. **Problem:** What limitation are you experiencing?
2. **Proposed solution:** How should it work?
3. **Use cases:** Provide specific scenarios
4. **Alternatives considered:** Other approaches you've tried

### Questions

For questions about usage:

1. **Search existing issues:** May already be answered
2. **Check documentation:** Review README and docs/
3. **Provide context:** What are you trying to do?
4. **Show your attempt:** Code snippets, configuration, etc.

## Getting Help

### Documentation

- [Main README](../README.md) - Project overview
- [Deployment Guide](DEPLOYMENT.md) - Deployment instructions
- [Adding Examples Guide](ADDING_EXAMPLES.md) - How to add prompt examples

### Communication

- **GitHub Issues:** For bugs and feature requests
- **Discussions:** For questions and community support
- **Code of Conduct:** Be respectful and inclusive

## Recognition

Contributions are appreciated and will be acknowledged in:
- Release notes (for significant contributions)
- Contributors list (if desired)

Thank you for contributing to LLM Prompt Builder! 🙏
