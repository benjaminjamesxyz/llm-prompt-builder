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

This project uses automated CI/CD with GitHub Actions to deploy to Cloudflare Pages.

### Branch Strategy

- **master** → Production (`prompt-builder.benjaminjames.xyz`)
- **staging** → Staging (`staging.prompt-builder.benjaminjames.xyz`)
- Pull requests to master → Run tests only

### Local Deployment (Wrangler)

Deploy directly from your local machine:

```bash
# Deploy to production
bun run deploy:prod

# Deploy to staging
bun run deploy:staging
```

### GitHub Actions CI/CD

Automated deployment is configured in `.github/workflows/deploy.yml`:

**Triggers:**
- Push to `master` or `staging` branches
- Pull requests to `master`

**Pipeline Steps:**
1. Checkout code
2. Setup Bun runtime
3. Install dependencies
4. TypeScript typecheck (blocking)
5. Run Vitest tests (blocking)
6. Build project
7. Deploy to Cloudflare Pages via Wrangler

**Required GitHub Secrets:**
- `CLOUDFLARE_ACCOUNT_ID` - Found in Cloudflare Dashboard → Workers & Pages
- `CLOUDFLARE_API_TOKEN` - Create in Cloudflare → My Profile → API Tokens
  - Permissions: Account > Pages > Edit
  - Account Resources: Include > Your Account

### Setting Up GitHub Secrets

1. Get your Cloudflare Account ID:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select your account
   - Navigate to Workers & Pages
   - Account ID is in the right sidebar

2. Create API Token:
   - Go to [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Ensure Account > Pages > Edit permission
   - Include your account in Account Resources

3. Add secrets to GitHub:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`

### DNS Configuration

Add these DNS records to your Cloudflare-managed domain:

```
Type: CNAME
Name: prompt-builder
Content: llm-prompt-builder.pages.dev
TTL: Auto
Proxy: Proxied (Orange cloud)

Type: CNAME
Name: staging
Content: llm-prompt-builder.pages.dev
TTL: Auto
Proxy: Proxied (Orange cloud)
```

### Manual Deployment Workflow

**Production Deployment:**
```bash
# Ensure you're on master branch
git checkout master
git pull origin master

# Make changes
git add .
git commit -m "your message"
git push origin master

# GitHub Actions automatically deploys
```

**Staging Deployment:**
```bash
# Create/update staging branch
git checkout staging
git pull origin staging

# Make changes
git add .
git commit -m "your message"
git push origin staging

# GitHub Actions automatically deploys
```

**Testing with Pull Requests:**
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and push
git add .
git commit -m "your message"
git push origin feature/your-feature

# Create PR to master
# Tests run automatically but no deployment
# Merge triggers production deployment
```

### Branch Protection Rules

In GitHub repository settings for `master` branch:
- Require status checks to pass before merging:
  - ✅ `test` (typecheck + tests)
  - ✅ `deploy-production`
- Require branches to be up-to-date before merging
- Optionally require pull request reviews

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

## Tech Stack

- **Framework**: Preact 10.x
- **Build Tool**: Vite 5.x
- **CSS**: Tailwind CSS 3.x
- **Package Manager**: bun
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
