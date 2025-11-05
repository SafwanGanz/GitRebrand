# 🎯 GETTING STARTED

Welcome to GitHub Username Auto-Updater! Follow these steps to get started in **5 minutes**.

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Run Setup Script
```powershell
.\setup.ps1
```

This will:
- ✓ Check your Node.js installation
- ✓ Install all dependencies
- ✓ Create your `.env` file

### Step 2: Get Your GitHub Token

1. Visit: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `Username Updater`
4. Select scopes:
   - ✅ `repo` (full control of private repositories)
   - ✅ `read:user` (read user profile data)
5. Click **"Generate token"**
6. **Copy the token** (starts with `ghp_`)

### Step 3: Configure `.env` File

Open `.env` and add:

```env
GITHUB_TOKEN=ghp_your_actual_token_here
OLD_USERNAME=your-old-username
NEW_USERNAME=your-new-username
```

---

## 🧪 Test Run (IMPORTANT!)

**Always run with `--dry-run` first!**

```bash
node index.js --dry-run
```

This shows what would change **without actually changing anything**.

Review the output:
- How many repos will be updated?
- Which files will be changed?
- Does the replacement count look right?

---

## ✅ Production Run

If the dry-run looks good:

```bash
node index.js
```

That's it! The tool will:
1. Scan all your repositories
2. Find all occurrences of your old username
3. Replace with your new username
4. Commit the changes with a clean commit message

---

## 📊 What to Expect

Example output:

```
🚀 GitHub Username Auto-Updater

✓ Authenticated as yourname
ℹ Replacing: olduser → newuser

✓ Found 25 repositories

[1/25] yourname/awesome-project
────────────────────────────────
  ➜ README.md (3 replacements)
  ➜ package.json (2 replacements)
  ○ index.js (no changes)
✓ Committed 2 file(s)

... (continues for all repos)

────────────────────────────────
📊 Summary:
  Total repositories: 25
  ✓ Updated: 18
  ⚠ Skipped: 5
  ✗ Failed: 2
  📝 Total files changed: 47
  🔄 Total replacements: 156
────────────────────────────────
```

---

## 🎓 Command Reference

| Command | Description |
|---------|-------------|
| `node index.js --help` | Show help |
| `node index.js --dry-run` | Test without committing |
| `node index.js` | Run for real |
| `.\setup.ps1` | Run setup script |

---

## 📚 Need More Help?

- **Quick Guide**: See `QUICKSTART.md`
- **Full Documentation**: See `README.md`
- **Testing Guide**: See `TESTING.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`

---

## ⚠️ Safety Tips

✅ **DO:**
- Run `--dry-run` first
- Review the output carefully
- Have backups of important repos
- Test on a single repo first (if nervous)

❌ **DON'T:**
- Run without testing first
- Skip the dry-run
- Use someone else's token
- Commit the `.env` file

---

## 🚀 Ready?

Run this right now:

```bash
.\setup.ps1
```

Then follow the prompts!

**You're 5 minutes away from updating your entire GitHub profile! 🎉**
