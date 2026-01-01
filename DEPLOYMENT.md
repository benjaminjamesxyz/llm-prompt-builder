# Deployment Setup Guide

This guide walks you through setting up automated CI/CD deployment for the LLM Prompt Builder project.

## ✅ What's Been Completed

### Files Created
- ✅ `wrangler.toml` - Cloudflare Pages configuration
- ✅ `.github/workflows/deploy.yml` - GitHub Actions CI/CD pipeline
- ✅ `vitest.config.ts` - Vitest testing configuration
- ✅ `src/test/` - Test setup and utilities
- ✅ Test files with 40 tests passing
- ✅ `AGENTS.md` - Updated with testing guidelines

### Features Added
- ✅ Vitest testing framework with jsdom environment
- ✅ 40 automated tests (validation, formatters, components)
- ✅ GitHub Actions CI/CD pipeline
- ✅ Production and staging environments
- ✅ Test blocking on deployment failures
- ✅ Branch protection ready

### Branches Created
- ✅ `master` - Production branch
- ✅ `staging` - Staging branch

---

## 🚀 Next Steps: Complete Setup

### Step 1: Set Up GitHub Secrets

You need to add two secrets to your GitHub repository.

#### 1.1 Get Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account from the top dropdown
3. Navigate to **Workers & Pages**
4. Find your **Account ID** in the right sidebar
5. Copy the Account ID (looks like: `a1b2c3d4e5f6g7h8i9j0`)

#### 1.2 Create Cloudflare API Token

1. Go to [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use the **"Edit Cloudflare Workers"** template or:
   - Click **Create Custom Token**
4. Configure permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account Resources** → **Include** → **Your Account**
5. Click **Continue to summary**
6. Click **Create Token**
7. **IMPORTANT**: Copy the token immediately (you won't see it again!)

#### 1.3 Add Secrets to GitHub

1. Go to your repository: [Settings → Secrets and variables → Actions](https://github.com/benjaminjamesxyz/llm-prompt-builder/settings/secrets/actions)
2. Click **New repository secret**
3. Add first secret:
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
   - **Value**: Your Account ID from Step 1.1
   - Click **Add secret**
4. Add second secret:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: Your API Token from Step 1.2
   - Click **Add secret**

---

### Step 2: Configure DNS Records

Add these DNS records to your Cloudflare-managed domain.

#### 2.1 Go to DNS Settings

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **benjaminjames.xyz** zone
3. Click **DNS** in the left sidebar

#### 2.2 Add Production DNS Record

1. Click **Add record**
2. Configure:
   - **Type**: `CNAME`
   - **Name**: `prompt-builder`
   - **Target**: `llm-prompt-builder.pages.dev`
   - **TTL**: Auto
   - **Proxy status**: ☑️ Proxied (Orange cloud icon)
3. Click **Save**

#### 2.3 Add Staging DNS Record

1. Click **Add record** again
2. Configure:
   - **Type**: `CNAME`
   - **Name**: `staging`
   - **Target**: `llm-prompt-builder.pages.dev`
   - **TTL**: Auto
   - **Proxy status**: ☑️ Proxied (Orange cloud icon)
3. Click **Save**

#### 2.4 Verify DNS Records

After a few minutes, your records should look like:

| Type  | Name           | Target                          | Proxy | TTL  |
|-------|----------------|---------------------------------|--------|------|
| CNAME | prompt-builder | llm-prompt-builder.pages.dev      | ☑️     | Auto |
| CNAME | staging        | llm-prompt-builder.pages.dev      | ☑️     | Auto |

---

### Step 3: Set Up Branch Protection (Optional but Recommended)

Configure GitHub to prevent merging PRs when tests fail.

1. Go to repository [Settings → Branches](https://github.com/benjaminjamesxyz/llm-prompt-builder/settings/branches)
2. Click **Add branch protection rule**
3. Configure:
   - **Branch name pattern**: `master`
   - ☑️ **Require status checks to pass before merging**
     - ☑️ `test` (required)
     - ☑️ `deploy-production` (required)
   - ☑️ **Require branches to be up to date before merging**
   - Optionally: ☑️ **Require pull request reviews before merging**
4. Click **Create**

---

## 🧪 Test the Setup

### Test 1: Run Local Tests

```bash
# Clone or navigate to your project
cd llm-prompt-builder

# Install dependencies
bun install

# Run tests
bun run test:ci

# Expected output:
# Test Files  3 passed (3)
#      Tests  40 passed (40)
#   Duration  ~2s
```

### Test 2: Verify GitHub Actions Triggers

1. Go to [Actions tab](https://github.com/benjaminjamesxyz/llm-prompt-builder/actions)
2. You should see recent workflows running or completed
3. Click on the workflow to see:
   - ✅ Test job (passed)
   - ✅ Deploy to Production job (passed)

### Test 3: Test Staging Deployment

1. Make a small change to `staging` branch:
   ```bash
   git checkout staging
   # Make a change (e.g., update README title)
   git add .
   git commit -m "test: staging deployment"
   git push origin staging
   ```

2. Monitor GitHub Actions:
   - Go to [Actions tab](https://github.com/benjaminjamesxyz/llm-prompt-builder/actions)
   - Wait for workflow to complete (~2 minutes)
   - Check for "Deploy to Staging" job

3. Visit staging site:
   - https://staging.prompt-builder.benjaminjames.xyz

### Test 4: Test Production Deployment

After staging works:

1. Merge `staging` into `master`:
   ```bash
   git checkout master
   git merge staging
   git push origin master
   ```

2. Monitor GitHub Actions for production deployment

3. Visit production site:
   - https://prompt-builder.benjaminjames.xyz

---

## 📋 Daily Development Workflow

### Make Changes to Production

```bash
# 1. Checkout master
git checkout master
git pull origin master

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes
# Edit files, add features, fix bugs

# 4. Test locally
bun install          # Install new dependencies if needed
bun run typecheck    # TypeScript validation
bun run test:ci      # Run tests
bun run dev           # Start dev server (http://localhost:3000)

# 5. Commit and push
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name

# 6. Create Pull Request
# Go to GitHub and create PR from feature/your-feature-name to master
# Tests run automatically - wait for them to pass
# Merge when approved

# 7. Production deploys automatically on merge
```

### Deploy to Staging

```bash
# 1. Checkout staging
git checkout staging
git pull origin staging

# 2. Make changes
# Edit files

# 3. Test locally
bun run test:ci

# 4. Commit and push
git add .
git commit -m "test: staging update"
git push origin staging

# 5. Staging deploys automatically
# Wait ~2 minutes
# Visit: https://staging.prompt-builder.benjaminjames.xyz
```

---

## 🐛 Troubleshooting

### GitHub Actions Fails

**Problem**: Workflow fails with "Authentication failed"

**Solution**:
- Verify `CLOUDFLARE_API_TOKEN` is correct
- Check token has **Account > Pages > Edit** permission
- Ensure token includes your account in **Account Resources**

**Problem**: Workflow fails with "Account not found"

**Solution**:
- Verify `CLOUDFLARE_ACCOUNT_ID` is correct
- Check you're using the right Cloudflare account

### DNS Issues

**Problem**: Can't access `prompt-builder.benjaminjames.xyz`

**Solutions**:
1. Wait up to 24 hours for DNS propagation
2. Check DNS records match exactly:
   - Name: `prompt-builder`
   - Target: `llm-prompt-builder.pages.dev`
   - Proxy: Orange cloud (not gray cloud)
3. Use [DNS Checker](https://dnschecker.org/) to verify propagation

### Tests Fail Locally

**Problem**: `bun run test:ci` fails

**Solutions**:
1. Install dependencies: `bun install`
2. Check Node version: `bun --version` (should be 1.x)
3. Clear cache: `rm -rf node_modules && bun install`

---

## 📊 Monitoring

### Check Deployment Status

- **GitHub Actions**: https://github.com/benjaminjamesxyz/llm-prompt-builder/actions
- **Cloudflare Pages**: https://dash.cloudflare.com → Workers & Pages

### View Logs

1. Go to [Actions tab](https://github.com/benjaminjamesxyz/llm-prompt-builder/actions)
2. Click on workflow run
3. Click on job (test or deploy)
4. View logs in right panel

### Access Deployed Sites

- **Production**: https://prompt-builder.benjaminjames.xyz
- **Staging**: https://staging.prompt-builder.benjaminjames.xyz
- **Cloudflare Pages**: https://llm-prompt-builder.pages.dev (auto-generated)

---

## 🎯 Success Checklist

- [ ] Added `CLOUDFLARE_ACCOUNT_ID` to GitHub Secrets
- [ ] Added `CLOUDFLARE_API_TOKEN` to GitHub Secrets
- [ ] Added production DNS record (`prompt-builder`)
- [ ] Added staging DNS record (`staging`)
- [ ] Set up branch protection rules (optional)
- [ ] Ran `bun run test:ci` locally - 40 tests passed
- [ ] Verified GitHub Actions runs successfully on `master` push
- [ ] Verified staging deployment works
- [ ] Verified production deployment works
- [ ] Can access https://prompt-builder.benjaminjames.xyz
- [ ] Can access https://staging.prompt-builder.benjaminjames.xyz

---

## 📚 Additional Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Wrangler Docs**: https://developers.cloudflare.com/pages/functions/wrangler/
- **Vitest Docs**: https://vitest.dev/
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/

---

## 💡 Tips

1. **Always run tests before pushing**: `bun run test:ci`
2. **Check Actions tab after every push**: Catch issues early
3. **Use staging for testing**: Don't break production!
4. **Keep secrets safe**: Never commit API tokens
5. **Monitor DNS propagation**: Use dnschecker.org if sites don't load

---

## 🆘 Need Help?

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review GitHub Actions logs
3. Check Cloudflare Pages deployment logs
4. Verify DNS configuration
5. Run tests locally: `bun run test:ci`

For more help:
- GitHub Issues: https://github.com/benjaminjamesxyz/llm-prompt-builder/issues
- Cloudflare Community: https://community.cloudflare.com/

---

## ✨ What's Next?

After setup is complete:

1. **Add more tests**: Test other components and utilities
2. **Set up staging tests**: Add staging-specific tests
3. **Configure notifications**: Get Slack/Discord alerts on deployments
4. **Add performance monitoring**: Set up analytics
5. **Document API**: If adding new features

---

**Happy deploying! 🚀**
