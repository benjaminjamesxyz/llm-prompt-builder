# LLM Prompt Builder

A structured prompt engineering tool built with Rsbuild, Preact, and Tailwind CSS.

## Features

- Build structured prompts for various AI models (Generic, Gemini, Claude, OpenAI, Llama, DeepSeek, Qwen, GLM)
- Support for image generation (Midjourney, DALL-E, Imagen)
- Support for video generation (Sora, Runway, Veo)
- Multiple output formats: XML, JSON, YAML, TOON, Markdown
- Syntax highlighting with PrismJS
- Dark mode with 4 color themes (Catppuccin, Dracula, Gruvbox, Tokyo Night)
- LocalStorage auto-save
- Export/Import session files
- Copy to clipboard functionality
- Download prompts as files

## Project Structure

```
src/
├── components/       # React/Preact components
│   ├── Button.tsx
│   ├── SimpleItem.tsx
│   ├── Block.tsx
│   ├── BlockPicker.tsx
│   └── Icons.tsx
├── data/            # Constants and configuration
│   ├── blockDefs.ts
│   ├── models.ts
│   └── examples.ts
├── docs/            # Project documentation
│   ├── ADDING_EXAMPLES.md   # Guide for adding prompt examples
│   ├── DEPLOYMENT.md         # Deployment instructions
│   └── CONTRIBUTING.md       # Contribution guidelines
├── utils/           # Utility functions
│   ├── uuid.ts
│   ├── formatters.ts
│   ├── storage.ts
│   └── prism.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main application
├── main.tsx         # Entry point
└── index.css        # Global styles and Tailwind
```

## Development

### Prerequisites

- [bun](https://bun.sh/) - JavaScript runtime and package manager

### Installation

```bash
bun install
```

### Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
bun run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
bun run preview
```

## Deployment

Automated CI/CD with GitHub Actions deploys to Cloudflare Pages.

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

For contribution guidelines, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

For adding examples and templates, see [docs/ADDING_EXAMPLES.md](docs/ADDING_EXAMPLES.md).

### Branch Strategy

- **master** → Production
- Pull requests to master → Preview deployment

### Local Deployment (Wrangler)

Deploy directly from your local machine:

```bash
bun run deploy
```

### Testing

Run tests locally before pushing:

```bash
# Run all tests in watch mode
bun run test

# Run tests once (CI mode)
bun run test:ci

# Run tests with coverage report
bun run test:coverage
```

All tests must pass before deployment.

## Adding Examples and Templates

This project includes pre-built example prompts for each supported model. You can add new examples following patterns in `src/data/`.

See [docs/ADDING_EXAMPLES.md](docs/ADDING_EXAMPLES.md) for comprehensive documentation on:
- Understanding the data structure
- Creating new example prompts
- Adding blocks and models
- Best practices and patterns
- Testing and validation

### Quick Reference

| File | Purpose |
|------|---------|
| `src/data/blockDefs.ts` | Block definitions (ROLE, TASK, etc.) |
| `src/data/models.ts` | Model configurations (which blocks each model uses) |
| `src/data/examples.ts` | Example prompts organized by model |
| `src/types/index.ts` | TypeScript type definitions |

### Available Block Categories

**Text Models:**
- Basic: role, task, context, rules, goal, example, input
- Model-specific: system/user/assistant (OpenAI), sys_instr/user_input/model_out (Gemini)
- Advanced: thinking (Claude), deepseek_think (DeepSeek R1), tools
- Tree of Thought: tot_problem, tot_branch, tot_thought, tot_evaluation, tot_solution

**Image Generation:**
- Visual: subject, scene, visuals, environment, style, lighting, color, aesthetic
- Technical: camera, shot_type, angle
- Negative: negative
- Parameters: params

**Video Generation:**
- All image blocks + motion, movement, audio, sfx, music

### Adding a Simple Example

```typescript
import { ModelExamples } from '../types';
import { uuid } from '../utils/uuid';

export const MODEL_EXAMPLES: ModelExamples = {
  // ... existing examples
  openai: [
    {
      name: "Your Example Name",
      nodes: [
        { id: uuid(), tag: "SYSTEM", content: "You are a helpful assistant." },
        { id: uuid(), tag: "USER", content: "Your user query here." }
      ]
    }
  ]
};
```

### Adding Complex Nested Example

```typescript
{
  name: "Complex Prompt",
  nodes: [
    { id: uuid(), tag: "ROLE", content: "Senior Software Engineer" },
    {
      id: uuid(),
      tag: "RULES",
      isList: true,
      children: [
        { id: uuid(), tag: "ITEM", content: "Maintain original functionality" },
        { id: uuid(), tag: "ITEM", content: "Use modern syntax" }
      ]
    },
    { id: uuid(), tag: "TASK", content: "Refactor the code." }
  ]
}
```

For detailed examples and advanced patterns (including Tree of Thought), see the [full documentation](docs/ADDING_EXAMPLES.md).

## Troubleshooting

### Project not found error

If wrangler deployment fails with "Project not found":
1. Verify project name in `wrangler.toml` matches Cloudflare
2. Check `CLOUDFLARE_ACCOUNT_ID` GitHub Secret is correct
3. Ensure project exists in Cloudflare Dashboard
4. API Token has Pages permission

### DNS propagation issues

If custom domain doesn't work:
1. Wait up to 24 hours for DNS propagation
2. Check DNS records in Cloudflare Dashboard
3. Use https://dnschecker.org to verify
4. Ensure SSL/TLS is configured (Full mode recommended)

### Preview deployment not created

If PR preview deployment doesn't appear:
1. Ensure PR is created against `master` branch
2. Check GitHub Actions logs for `deploy` job
3. Verify wrangler CLI created preview successfully
4. Check Cloudflare Pages → Deployments tab

## Tech Stack

- **Framework**: Preact 10.28.1
- **Build Tool**: Rsbuild 1.7.1
- **CSS**: Tailwind CSS 4.1.18
- **Package Manager**: bun 1.3.5
- **Runtime**: bun 1.3.5
- **Syntax Highlighting**: PrismJS
- **YAML**: Rust/WASM (serde_yaml)
- **Language**: TypeScript 5.9.3

## Performance Optimizations

- Code splitting for PrismJS and YAML modules
- Lazy loading of syntax highlighting components
- Optimized bundle size with Rsbuild's tree shaking
- Static build ready for edge deployment
- CSS extraction and minification

## Browser Support

Modern browsers with ES2020+ support:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

GPL-3.0
