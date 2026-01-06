# Deployment Guide

This guide covers detailed deployment instructions for the LLM Prompt Builder to Cloudflare Pages.

## Table of Contents

- [Overview](#overview)
- [Cloudflare Pages Setup](#cloudflare-pages-setup)
- [Required GitHub Secrets](#required-github-secrets)
- [GitHub Actions Workflow](#github-actions-workflow)
- [Branch Strategy](#branch-strategy)
- [Local Deployment](#local-deployment)
- [DNS Configuration](#dns-configuration)
- [Branch Protection Rules](#branch-protection-rules)
- [Manual Deployment Workflows](#manual-deployment-workflows)
- [Troubleshooting](#troubleshooting)

## Overview

The LLM Prompt Builder uses GitHub Actions to automatically deploy to Cloudflare Pages on:
- Push to `master` branch
- Pull requests to `master` branch (preview deployments)

This setup requires minimal manual intervention once initial configuration is complete.

## Cloudflare Pages Setup

### Initial Project Creation

1. **Create Cloudflare Account**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Sign up for a free account

2. **Create Pages Project**
   - Navigate to Workers & Pages → Create Application
   - Choose "Direct Upload" or connect to GitHub
   - For this project: Connect to GitHub repository
   - Configure build settings:
     - Build command: `bun run build`
     - Build output directory: `dist`

3. **Configure Project Settings**
   - Project name: `llm-prompt-builder`
   - Production branch: `master`
   - Preview deployments: Enabled

## Required GitHub Secrets

The GitHub Actions workflow requires two Cloudflare secrets:

### CLOUDFLARE_ACCOUNT_ID

Your Cloudflare Account ID uniquely identifies your Cloudflare account.

**How to find it:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account (if multiple)
3. Navigate to Workers & Pages
4. Your Account ID is displayed in the right sidebar
   - Format: 32-character hexadecimal string
   - Example: `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d`

**Add to GitHub:**
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `CLOUDFLARE_ACCOUNT_ID`
4. Value: Paste your Account ID
5. Click "Add secret"

### CLOUDFLARE_API_TOKEN

API Token grants GitHub Actions permission to deploy to your Cloudflare Pages.

**How to create it:**
1. Go to [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use one of these templates:
   - **"Edit Cloudflare Workers"** (recommended)
   - Or "Custom Token" for granular control
4. Configure permissions:
   - Account → Cloudflare Pages → Edit
   - Account Resources → Include → Your Account
5. Set expiration (recommended: 6 months or longer)
6. Click "Continue to summary" → "Create Token"
7. **Copy the token immediately** (won't be shown again)

**Add to GitHub:**
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `CLOUDFLARE_API_TOKEN`
4. Value: Paste your API token
5. Click "Add secret"

### Security Notes

- Never commit secrets to the repository
- Use separate tokens for development vs production if needed
- Rotate API tokens regularly (every 6 months recommended)
- Revoke old tokens when creating new ones

## GitHub Actions Workflow

### Triggers

The workflow runs on:
- **Push to `master` branch** → Triggers production deployment
- **Pull requests to `master` branch** → Triggers preview deployment

### Pipeline Steps

1. **Checkout Code**
   - Retrieves repository code
   - Uses the latest commit

2. **Setup Bun Runtime**
   - Installs Bun JavaScript runtime
   - Uses version specified in `package.json`

3. **Install Dependencies**
   - Runs `bun install`
   - Installs all dependencies from `package.json`

4. **Build WASM**
   - Runs `bun run build:wasm`
   - Compiles Rust code to WebAssembly
   - Essential for all prompt generation features

5. **Lint Rust**
   - Runs `cargo clippy` and `cargo fmt`
   - Ensures Rust code quality and formatting

6. **Test Rust**
   - Runs `bun run test:wasm`
   - Validates WASM logic

7. **TypeScript Typecheck**
   - Runs `bun run typecheck`
   - **Blocking step** - fails workflow if type errors exist
   - Enforces strict TypeScript compliance

8. **Run Vitest Tests**
   - Runs `bun run test:ci`
   - **Blocking step** - fails workflow if tests fail
   - Ensures frontend code quality

9. **Build Project**
   - Runs `bun run build`
   - Compiles Preact/TypeScript code
   - Outputs to `dist/` directory

10. **Deploy to Cloudflare Pages**
   - Uses Wrangler CLI
   - Deploys `dist/` directory
   - Creates preview for PRs, production for master

### Workflow Location

The workflow file is located at:
```
.github/workflows/deploy.yml
```

You can view the complete workflow configuration in the repository.

## Branch Strategy

### Production Branch: master

- **Purpose:** Production deployments
- **Deployment:** Automatic on push to master
- **URL:** Production URL
- **Protection:** Branch protection rules enabled (see below)

### Feature Branches

- **Naming Convention:** `feature/your-feature-name`
- **Purpose:** Development and testing
- **Deployment:** None (no automatic deployment)
- **Merge:** Pull request to master

### Preview Deployments

- **Triggered by:** Pull requests to master
- **URL:** Unique preview URL for each PR
- **Purpose:** Testing before production deployment
- **Duration:** Available until PR is closed

## Local Deployment

### Using Wrangler CLI

Deploy directly from your local machine:

```bash
# Ensure dependencies are installed
bun install

# Build WASM module
bun run build:wasm

# Build the project
bun run build

# Deploy to Cloudflare Pages
bun run deploy
```

### Prerequisites

- Wrangler CLI installed (included with Cloudflare Workers setup)
- Authentication configured (`wrangler login`)
- Project linked to Cloudflare Pages

### Use Cases

- **Quick fixes:** Deploy without waiting for CI/CD
- **Testing:** Deploy to preview before PR
- **Bypass CI:** When tests are flaky (not recommended)

## DNS Configuration

### Example Configuration

This is the DNS configuration used for `prompt-builder.benjaminjames.xyz` (for reference only):

```dns
Type: CNAME
Name: prompt-builder
Content: llm-prompt-builder.pages.dev
TTL: Auto
Proxy: Proxied (Orange cloud)
```

### Setting Up Custom Domain

If you're using Cloudflare Pages, your repository likely has the format:
```
your-repo.pages.dev
```

To use a custom domain:

1. **Configure Cloudflare Pages**
   - Go to Workers & Pages → Your Project → Custom Domains
   - Click "Set up a custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **Add DNS Records**
   - If your domain is on Cloudflare: Add CNAME record
   - If your domain is elsewhere: Add CNAME to your DNS provider
   - Wait for DNS propagation (up to 24 hours)

3. **SSL/TLS**
   - Cloudflare provides free SSL certificates
   - Ensure "Full" or "Full (strict)" mode is enabled
   - HTTPS will work automatically after SSL provisioned

## Branch Protection Rules

### Recommended Settings

For the `master` branch in GitHub repository settings:

### Require Status Checks

Require the following status checks to pass before merging:
- ✅ `test` (includes typecheck + tests)
- ✅ `deploy` (successful deployment)

### Require Branches Up-to-Date

- "Require branches to be up-to-date before merging" should be **enabled**
- Ensures master branch is not behind remote
- Prevents merge conflicts

### Optional: Require Pull Request Reviews

- "Require pull request reviews" should be **considered**
- Enables code review process
- Set required number of reviewers (e.g., 1)
- Optional based on project team size and workflow

### Dismiss Stale Reviews

- "Automatically dismiss approving reviews when new commits are pushed" should be **enabled**
- Ensures changes are reviewed against latest code
- Prevents merging outdated approvals

## Manual Deployment Workflows

### Production Deployment

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

### Testing with Pull Requests

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

### Workflow Summary

| Action | Trigger | CI/CD | Deployment |
|---------|----------|----------|------------|
| Push to master | Yes | Yes | Production |
| PR to master | Yes | Yes | Preview |
| Push to feature | No | No | No |
| Merge PR to master | Yes | Yes | Production |

## Troubleshooting

### Project Not Found Error

**Symptom:** Wrangler deployment fails with "Project not found"

**Causes:**
1. Project name in `wrangler.toml` doesn't match Cloudflare
2. Project was deleted from Cloudflare Dashboard
3. Wrong account ID in GitHub Secrets

**Solutions:**
1. Verify project name in `wrangler.toml` matches Cloudflare Dashboard
2. Check `CLOUDFLARE_ACCOUNT_ID` GitHub Secret is correct
3. Ensure project exists in Cloudflare Dashboard
4. Re-authenticate with `wrangler login`

### Permission Errors

**Symptom:** Deployment fails with permission denied or 403 errors

**Causes:**
1. API Token has wrong permissions
2. API Token expired
3. Account Resources don't include your account

**Solutions:**
1. Verify API Token has "Account > Pages > Edit" permission
2. Check Account Resources includes your account
3. Create a new API Token (may have expired)
4. Update GitHub Secrets with new token

### DNS Propagation Issues

**Symptom:** Custom domain doesn't work after deployment

**Causes:**
1. DNS records not configured correctly
2. DNS propagation incomplete (takes up to 24 hours)
3. SSL/TLS not configured
4. Proxy settings incorrect

**Solutions:**
1. Wait up to 24 hours for DNS propagation
2. Check DNS records in Cloudflare Dashboard
3. Use https://dnschecker.org to verify DNS
4. Ensure SSL/TLS is configured (Full mode recommended)
5. Check proxy settings (Orange cloud = Proxied)

### Preview Deployment Not Created

**Symptom:** PR preview deployment doesn't appear

**Causes:**
1. PR is not against `master` branch
2. GitHub Actions workflow failed
3. Wrangler CLI didn't create preview successfully
4. Permissions issue with Cloudflare API

**Solutions:**
1. Ensure PR is created against `master` branch
2. Check GitHub Actions logs for `deploy` job
3. Verify wrangler CLI created preview successfully
4. Check Cloudflare Pages → Deployments tab
5. Verify API Token has correct permissions

### Typecheck Failures

**Symptom:** GitHub Actions fails at TypeScript typecheck step

**Causes:**
1. TypeScript compilation errors
2. Missing type definitions
3. Strict mode violations (`noUnusedLocals`, `noUnusedParameters`)

**Solutions:**
1. Run `bun typecheck` locally to see errors
2. Fix all type errors before pushing
3. Ensure all imports are typed
4. Use `unknown` instead of `any` for dynamic types

### Test Failures

**Symptom:** GitHub Actions fails at test step

**Causes:**
1. Code changes broke tests
2. Test environment differences
3. Missing test dependencies

**Solutions:**
1. Run `bun test` locally to reproduce
2. Review test changes in the PR
3. Check test dependencies are installed
4. Update tests to reflect new behavior

### Build Failures

**Symptom:** GitHub Actions fails at build step

**Causes:**
1. Build configuration errors
2. Missing dependencies
3. TypeScript errors (typecheck should catch these first)

**Solutions:**
1. Check rsbuild configuration in `rsbuild.config.ts`
2. Ensure all dependencies are installed
3. Review build logs in GitHub Actions
4. Test locally with `bun run build`

## Additional Resources

- [Main README](../README.md) - Project overview
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Adding Examples Guide](ADDING_EXAMPLES.md) - How to add prompt examples
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Getting Help

If you encounter deployment issues not covered here:

1. Check GitHub Actions logs for detailed error messages
2. Review Cloudflare Dashboard for project status
3. Verify all GitHub Secrets are correctly configured
4. Consult Cloudflare Pages documentation
5. Open an issue in the repository with:
   - Error message
   - GitHub Actions workflow run link
   - Steps taken to resolve

---

**Happy deploying! 🚀**
