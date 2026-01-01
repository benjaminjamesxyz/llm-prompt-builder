# LLM Prompt Builder

A structured prompt engineering tool built with Vite, Preact, and Tailwind CSS.

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

- [bun](https://bun.sh/) - JavaScript runtime
- [pnpm](https://pnpm.io/) - Package manager

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
pnpm build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

## Deployment to Cloudflare Pages

This project is optimized for Cloudflare Pages deployment.

### Option 1: Direct Upload

1. Build the project: `pnpm build`
2. Upload the contents of `dist/` to Cloudflare Pages

### Option 2: Git Integration

Cloudflare Pages automatically deploys from Git. The build configuration:

- **Build Command**: `pnpm build`
- **Build Output Directory**: `dist`
- **Node.js Version**: Latest

### Option 3: Wrangler

```bash
bun install
pnpm build
bunx wrangler pages deploy dist
```

## Tech Stack

- **Framework**: Preact 10.x
- **Build Tool**: Vite 5.x
- **CSS**: Tailwind CSS 3.x
- **Package Manager**: pnpm
- **Runtime**: bun
- **Syntax Highlighting**: PrismJS
- **YAML**: js-yaml
- **Language**: TypeScript

## Performance Optimizations

- Code splitting for PrismJS and YAML modules
- Lazy loading of syntax highlighting components
- Optimized bundle size with Vite's tree shaking
- Static build ready for edge deployment
- CSS extraction and minification

## Browser Support

Modern browsers with ES2020+ support:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

GPL-3.0
