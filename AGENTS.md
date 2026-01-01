# AGENTS.md

This file provides guidelines for agentic coding tools working in this repository.

## Build & Development Commands

```bash
# Start development server (runs on localhost:3000)
pnpm dev

# Build for production (outputs to dist/)
pnpm build

# Preview production build
pnpm preview

# TypeScript type checking (strict mode enabled - must pass)
pnpm typecheck

# No test framework is currently configured
# No linting tools (ESLint/Prettier) are configured
```

**IMPORTANT:** Always run `pnpm typecheck` before submitting changes. The project uses TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters`.

## Code Style Guidelines

### Imports
- Group imports: third-party libraries first, then internal modules
- Use named imports for utilities and types
- Preact imports: `import { useState, useEffect } from 'preact/hooks'`
```typescript
// Correct order:
import yaml from 'js-yaml';
import { Button } from './components/Button';
import { Node } from '../types';
```

### Component Patterns
- Use functional components with hooks exclusively (no class components except ErrorBoundary)
- Define props interface above the component
- Default props using parameter destructuring
```typescript
interface ButtonProps {
  onClick: () => void;
  children: any;
  variant?: ButtonVariant;
}

export const Button = ({ onClick, children, variant = 'primary' }: ButtonProps) => {
  // component logic
};
```

### TypeScript Conventions
- Use `interface` for object shapes with runtime needs, `type` for unions/aliases
- All function parameters must be typed
- Use generic types when appropriate (e.g., `safeJsonParse<T>`)
- Strict mode is enforced: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`
- Never use `any`; use `unknown` or proper types

### Naming Conventions
- Components: PascalCase (`Button`, `BlockPicker`)
- Functions/variables: camelCase (`saveToLocalStorage`, `validateNodes`)
- Constants/Enums: UPPER_SNAKE_CASE (`MAX_FILE_SIZE_BYTES`, `ValidationError`)
- Types/interfaces: PascalCase, descriptive (`Node`, `ModelConfig`)

### Error Handling
- Always use try-catch for async operations and external dependencies
- Return error objects with typed error codes for validation:
```typescript
export const validateFileSize = (file: File): { valid: boolean; error?: ValidationError } => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: ValidationError.FILE_TOO_LARGE };
  }
  return { valid: true };
};
```
- Use ErrorBoundary component for UI error containment
- Display user-friendly errors via Toast notifications with specific error codes
- Never use native alerts; use `showToast()` instead

### Styling & Theming
- Use Tailwind CSS for all styling
- Theme colors via CSS custom properties: `bg-bg`, `text-primary`, `border-border`
- Available themes: Catppuccin (default), Dracula, Gruvbox, Tokyo Night
- Combine utility classes for responsive design: `hidden sm:block`
- Use semantic color tokens from `tailwind.config.js`, never hardcode colors

### Accessibility Requirements (MANDATORY)
- All interactive elements must have `aria-label` or `aria-labelledby`
- Icon-only buttons require descriptive `aria-label` and `title` attributes
- Toggle buttons need `aria-pressed` state
- Dropdowns/selects need `aria-label` describing their purpose
- Use semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`
- Error messages should use `role="alert"` and `aria-live="polite"`

### State Management
- Use React hooks for local state (`useState`, `useMemo`, `useEffect`)
- Update state immutably: `setNodes([...nodes, newNode])`
- Use `useMemo` for expensive computations (formatters, filtering)
- LocalStorage operations use validation utilities for safety

### Security Best Practices
- Always sanitize user input before rendering HTML (use DOMPurify)
- Validate file uploads with size limits (500KB max) and schema validation
- Use `safeJsonParse()` for all JSON parsing
- Sanitize tag inputs with `sanitizeTagInput()` to prevent XSS
- Never use `dangerouslySetInnerHTML` without DOMPurify sanitization

### File Organization
- `src/components/` - Reusable UI components
- `src/data/` - Constants, configurations, block definitions
- `src/utils/` - Pure functions (formatters, validators, helpers)
- `src/types/` - TypeScript type definitions
- Export types from central index: `export type * from './types'`

### Performance Optimization
- Code split heavy dependencies via Vite config (prismjs, js-yaml)
- Lazy load modules when possible
- Use `useMemo` for derived data and computed values
- Minimize re-renders with proper dependency arrays

## Project-Specific Patterns

### Node Tree Structure
Nodes support recursive children. Use recursive functions for updates:
```typescript
const recUpdate = (list: Node[]): Node[] => list.map(n => {
  if (n.id === targetId) return { ...n, ...changes };
  if (n.children) return { ...n, children: recUpdate(n.children) };
  return n;
});
```

### Formatters
Output formats: `xml`, `json`, `yaml`, `toon`, `md`
Each formatter handles the Node tree recursively.

### Validation
Use ValidationError enum for error codes:
- `ERR_FILE_SIZE` - File exceeds 500KB
- `ERR_INVALID_JSON` - JSON parse failed
- `ERR_INVALID_SCHEMA` - Structure doesn't match Node interface
- `ERR_INVALID_TAG` - HTML injection attempt in tag field

When working on this codebase:
1. Run `pnpm typecheck` before committing
2. Add ARIA labels to all new interactive elements
3. Use TypeScript strict typing - no implicit any
4. Follow the existing import ordering
5. Validate all external data before using it
6. Test with multiple themes (Catppuccin, Dracula, Gruvbox, Tokyo Night)
