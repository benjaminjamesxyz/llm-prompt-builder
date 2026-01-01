# Quick Start: Create Cloudflare Pages Project

## Step 1: Build Locally

```bash
cd /path/to/llm-prompt-builder
bun install
bun run build
```

## Step 2: Create Project in Cloudflare Dashboard

1. **Go to Cloudflare Pages**
   - Visit: https://dash.cloudflare.com
   - Click "Workers & Pages" in left sidebar
   - Click "Create application" → "Pages"

2. **Choose Deployment Method: Direct Upload**
   - Click "Direct Upload"

3. **Upload Your Files**
   - Project name: `llm-prompt-builder`
   - Click "Upload files"
   - Select all files from `dist/` folder
   - Click "Create Project"

4. **Done!** Project created successfully.

## Step 3: Verify Project Exists

1. Go to: https://dash.cloudflare.com → Workers & Pages
2. You should see `llm-prompt-builder` in the list
3. Visit: https://llm-prompt-builder.pages.dev

## Step 4: Add Custom Domains (Optional)

### Production Domain

1. Go to: Workers & Pages → llm-prompt-builder → Custom domains
2. Click "Set up a custom domain"
3. Enter: `prompt-builder.benjaminjames.xyz`
4. Follow DNS configuration shown by Cloudflare

### Staging Domain

1. Go to: Workers & Pages → llm-prompt-builder → Settings → Preview deployments
2. Add custom domain for preview
3. Enter: `staging.prompt-builder.benjaminjames.xyz`
4. Follow DNS configuration

## Success Checklist

- [ ] Built project locally (bun run build)
- [ ] Created `llm-prompt-builder` project in Cloudflare
- [ ] Can access https://llm-prompt-builder.pages.dev
- [ ] Added production domain (optional)
- [ ] Added staging domain (optional)

## Next Steps

After project is created:
- GitHub Actions will be able to deploy
- If you want automatic deployments, set up Git integration in Cloudflare
- If you want manual deployment via GitHub Actions, add GitHub Secrets

**Done!** 🎉
