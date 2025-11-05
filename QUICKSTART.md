# 🚀 Quick Start Guide

## Step-by-Step Setup (5 minutes)

### 1. Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `GitHub Username Updater`
4. Select these scopes:
   - ✅ `repo` (all checkboxes under repo)
   - ✅ `read:user`
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

### 2. Configure the Tool

Open `.env` file and add your details:

```env
GITHUB_TOKEN=ghp_your_token_here
OLD_USERNAME=your-old-username
NEW_USERNAME=your-new-username
```

### 3. Test with Dry Run (IMPORTANT!)

```bash
node index.js --dry-run
```

This will show you what would change **without actually changing anything**.

### 4. Review the Output

Check the output carefully:
- How many repos will be updated?
- Which files will be changed?
- Does it look correct?

### 5. Run for Real

If everything looks good:

```bash
node index.js
```

Or with explicit parameters:

```bash
node index.js --old myoldname --new mynewname --token ghp_xxxxx
```

## ⚡ Quick Commands

```bash
# Show help
node index.js --help

# Dry run with CLI args
node index.js --old olduser --new newuser --token ghp_xxx --dry-run

# Real run using .env file
node index.js

# Real run with CLI args
node index.js --old olduser --new newuser --token ghp_xxx
```

## ✅ What Gets Updated?

The tool will update your username in these file types:
- `README.md`, `CHANGELOG.md`, etc.
- `package.json`, `package-lock.json`
- `.js`, `.ts`, `.jsx`, `.tsx` files
- `.yml`, `.yaml` files
- `.html`, `.css` files
- `.env`, `.gitignore`, etc.

## 🛡️ Safety Tips

1. ✅ **Always run `--dry-run` first**
2. ✅ **Start with a test repository** if you're nervous
3. ✅ **Have local backups** of important repos
4. ✅ **Check a few repos manually** after running

## 🎯 Example Session

```bash
# Install dependencies (first time only)
npm install

# Test run
node index.js --dry-run

# Review output...

# Apply changes
node index.js

# Done! Check your repos on GitHub
```

## 💡 Pro Tips

- The tool skips archived repositories automatically
- It waits 1.5 seconds between repos to respect rate limits
- All commits use the message: `chore: updated username from oldUsername to newUsername`
- Binary files are automatically skipped

## 🆘 Need Help?

Run with `--help` flag:
```bash
node index.js --help
```

Or check the full [README.md](./README.md) for detailed documentation.

---

**Ready to go! Start with `node index.js --dry-run` 🚀**
