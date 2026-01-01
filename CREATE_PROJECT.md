# Creating Cloudflare Pages Project

This guide walks you through creating the Cloudflare Pages project manually.

## Step 1: Create Project in Cloudflare Dashboard

### Option A: Direct Upload (Fastest - 2 minutes)

1. **Go to Cloudflare Pages**
   - Visit: https://dash.cloudflare.com
   - Click "Workers & Pages" in left sidebar
   - Click "Create application" → "Pages"

2. **Choose deployment method**
   - Select: **"Direct Upload"**

3. **Upload your files**
   - Click "Browse files" or drag & drop
   - Select the contents of `dist/` folder
   - **OR** if you don't have dist folder yet, skip to Option B

4. **Configure project**
   - Project name: `llm-prompt-builder`
   - Click "Create Project"

5. **Done!** Project created.

---

### Option B: Connect to Git (Recommended - 3 minutes)

1. **Go to Cloudflare Pages**
   - Visit: https://dash.cloudflare.com
   - Click "Workers & Pages" → "Create application" → "Pages"

2. **Choose deployment method**
   - Select: **"Connect to Git"**

3. **Select repository**
   - Select: `llm-prompt-builder` (or `benjaminjamesxyz/llm-prompt-builder`)

4. **Configure build settings**
   ```
   Project name: llm-prompt-builder

   Production branch: master
   Build command: bun run build
   Build output directory: dist

   Root directory: (leave empty)

   Environment variables:
   (leave empty for now)
   ```

5. **Click "Save and Deploy"**

6. **Wait for first deployment** (~2 minutes)
   - Cloudflare will:
     - Checkout your code
     - Install dependencies
     - Run `bun run build`
     - Deploy to Pages

7. **Done!** Project created and first deployment complete.

---

## Step 2: Configure Custom Domains

### Add Production Domain

1. **Go to project settings**
   - Workers & Pages → `llm-prompt-builder` → Custom domains

2. **Add custom domain**
   - Click "Set up a custom domain"
   - Enter: `prompt-builder.benjaminjames.xyz`
   - Click "Continue"

3. **Configure DNS** (Cloudflare will show instructions)
   - If `benjaminjames.xyz` is on Cloudflare DNS:
     - DNS records will be added automatically
     - Click "Continue" or "Activate domain"

   - If `benjaminjames.xyz` is on another DNS provider:
     - Add CNAME record:
       ```
       Type: CNAME
       Name: prompt-builder
       Target: llm-prompt-builder.pages.dev
       TTL: Auto
       ```
     - Click "Done"

4. **Activate** (if using Cloudflare DNS)
   - Click "Activate domain"

### Add Staging Domain (Optional but Recommended)

1. **Go to Preview deployments**
   - Workers & Pages → `llm-prompt-builder` → Settings → Preview deployments

2. **Add custom domain for preview**
   - Scroll to "Custom domains for preview"
   - Click "Add domain"
   - Enter: `staging.prompt-builder.benjaminjames.xyz`
   - Click "Continue"

3. **Configure DNS**
   - Similar to production domain setup
   - Add CNAME: `staging` → `llm-prompt-builder.pages.dev`

---

## Step 3: Verify Project Created

1. **Check project exists**
   - Go to: https://dash.cloudflare.com
   - Workers & Pages
   - You should see `llm-prompt-builder` in the list

2. **Visit default URL**
   - https://llm-prompt-builder.pages.dev

3. **Check custom domains** (if configured)
   - https://prompt-builder.benjaminjames.xyz
   - https://staging.prompt-builder.benjaminjames.xyz

---

## Step 4: Update GitHub Secrets (If using Option B)

If you used Option B (Git integration), you **don't need** GitHub Secrets!
Cloudflare manages authentication automatically.

However, if you want to use GitHub Actions with direct deployment:

1. **Get Project Name**
   - Project name: `llm-prompt-builder` (already correct in our workflow)

2. **No additional secrets needed for basic deployment**
   - Cloudflare Git integration handles auth
   - You might still want to add secrets if you need:
     - Environment variables
     - API tokens for other services

---

## Step 5: Test Deployment

### After Project Created

1. **Trigger a new deployment**
   ```bash
   # Make a small change
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: verify deployment after project creation"
   git push origin master
   ```

2. **Monitor deployment**
   - Go to: https://dash.cloudflare.com → Workers & Pages → llm-prompt-builder
   - Click "Deployments" tab
   - Watch new deployment build

3. **Visit deployed site**
   - https://llm-prompt-builder.pages.dev
   - Or: https://prompt-builder.benjaminjames.xyz (if configured)

---

## Troubleshooting

### Project name already exists

If you get "Project name already taken":
1. Use different name (e.g., `llm-prompt-builder-production`)
2. Update wrangler.toml and GitHub Actions
3. Or delete existing project if not needed

### DNS propagation issues

If custom domain doesn't work:
1. Wait up to 24 hours for DNS propagation
2. Check DNS records are correct
3. Use https://dnschecker.org to verify
4. Make sure SSL/TLS is configured (Full mode recommended)

### Build fails in Cloudflare

If Cloudflare Pages build fails:
1. Check build logs in Cloudflare Dashboard
2. Verify build command: `bun run build`
3. Verify output directory: `dist`
4. Make sure `bun.lock` is committed (we have it!)

---

## Quick Reference

### Project URLs
- Cloudflare Pages: https://llm-prompt-builder.pages.dev
- Production: https://prompt-builder.benjaminjames.xyz
- Staging: https://staging.prompt-builder.benjaminjames.xyz

### Dashboard Links
- Workers & Pages: https://dash.cloudflare.com → Workers & Pages
- Project Settings: https://dash.cloudflare.com → Workers & Pages → llm-prompt-builder → Settings
- API Tokens: https://dash.cloudflare.com/profile/api-tokens

---

## What's Next

After project is created:

1. **GitHub Actions** will work automatically
   - No changes needed to workflow
   - Project already exists, so deployment will succeed

2. **Add GitHub Secrets** (if using direct deployment)
   - Follow previous guide for `CLOUDFLARE_API_TOKEN`
   - Follow previous guide for `CLOUDFLARE_ACCOUNT_ID`

3. **Configure branch protection** (optional)
   - Require tests to pass before merging
   - See AGENTS.md for guidelines

---

## Success Checklist

- [ ] Created `llm-prompt-builder` project in Cloudflare
- [ ] Connected to Git repository (Option B) or uploaded files (Option A)
- [ ] First deployment succeeded
- [ ] Can access https://llm-prompt-builder.pages.dev
- [ ] Added production custom domain
- [ ] Added staging custom domain (optional)
- [ ] DNS records configured
- [ ] Can access custom domains
- [ ] GitHub Actions deployment works

---

**After completing this, your CI/CD should work! 🚀**
