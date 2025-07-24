# 📦 Publishing Pakoda Report to NPM

## Prerequisites

Before publishing, ensure you have:

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com)
2. **NPM Token**: Generate an automation token in your NPM account settings
3. **GitHub Repository**: Push your code to GitHub
4. **GitHub Secrets**: Configure required secrets in your repository

## Required GitHub Secrets

Add these secrets to your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Required Secrets:
- `NPM_TOKEN` - Your NPM automation token for publishing packages
- `GITHUB_TOKEN` - Automatically provided by GitHub (no action needed)

### How to get NPM Token:
1. Login to [npmjs.com](https://www.npmjs.com)
2. Go to Account Settings > Access Tokens
3. Generate a new "Automation" token
4. Copy the token and add it to GitHub Secrets

## Publishing Methods

### Method 1: Manual Workflow Trigger (Recommended)

1. **Go to GitHub Actions tab** in your repository
2. **Select "Publish Pakoda Report to NPM"** workflow
3. **Click "Run workflow"**
4. **Choose version bump**: patch, minor, or major
5. **Click "Run workflow"** to start the process

This method will:
- ✅ Run tests automatically
- ✅ Bump version in package.json
- ✅ Create a git tag
- ✅ Build TypeScript
- ✅ Publish to NPM
- ✅ Create GitHub release

### Method 2: Git Tag Push

1. **Bump version locally:**
   ```bash
   npm version patch  # or minor/major
   ```

2. **Push tags to GitHub:**
   ```bash
   git push origin main --tags
   ```

This will automatically trigger the publish workflow.

### Method 3: Manual Publishing

```bash
# Build the package
npm run build

# Bump version
npm version patch

# Publish to NPM
npm publish --access public

# Push changes and tags
git push origin main --tags
```

## Workflow Features

### 🧪 Automated Testing
- Tests on Ubuntu, Windows, and macOS
- Tests with Node.js versions 16, 18, and 20
- Runs Playwright tests with the reporter
- Validates TypeScript compilation

### 📦 Smart Publishing
- Only publishes if tests pass
- Includes provenance information
- Creates GitHub releases automatically
- Updates version badges
- Generates beautiful release notes

### 🔒 Security
- Uses NPM provenance for supply chain security
- Requires NPM authentication token
- Validates package integrity before publishing

## Release Process

1. **Continuous Integration** (`ci.yml`)
   - Runs on every push/PR
   - Tests across multiple environments
   - Validates package can be built

2. **Publishing** (`publish.yml`)
   - Triggered by tags or manual workflow
   - Runs comprehensive tests
   - Publishes to NPM with provenance
   - Creates GitHub release

3. **Release Creation** (`release.yml`)
   - Creates detailed release notes
   - Generates changelog from commits
   - Includes installation instructions

## Version Management

### Semantic Versioning
- **patch**: Bug fixes (1.0.0 → 1.0.1)
- **minor**: New features (1.0.0 → 1.1.0) 
- **major**: Breaking changes (1.0.0 → 2.0.0)

### Current Version
The package is currently at version **1.0.1** (updated from 1.0.0)

## Monitoring

### After Publishing
- ✅ Check [NPM package page](https://www.npmjs.com/package/pakoda-report)
- ✅ Verify GitHub release was created
- ✅ Test installation: `npm install pakoda-report`
- ✅ Check package works in a new project

### Troubleshooting

**If publishing fails:**
1. Check GitHub Actions logs
2. Verify NPM_TOKEN is correct
3. Ensure package name is available
4. Check Node.js version compatibility

**Common issues:**
- NPM token expired → Generate new token
- Package name taken → Change name in package.json
- Tests failing → Fix issues before publishing

## Example Usage After Publishing

```bash
# Install the published package
npm install pakoda-report --save-dev

# Add to playwright.config.js
export default defineConfig({
  reporter: [
    ['list'],
    ['pakoda-report', { outputDir: 'pakoda-report' }]
  ],
});

# Run tests
npx playwright test
```

## Support

If you encounter issues during publishing:
1. Check GitHub Actions workflow logs
2. Verify all secrets are properly configured
3. Ensure NPM token has correct permissions
4. Create an issue in the repository

---

**🚀 Ready to publish your beautiful Playwright reporter to the world!**