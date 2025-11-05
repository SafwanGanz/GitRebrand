# 🚀 GitHub Username Auto-Updater

A powerful, production-ready CLI tool that automatically finds and replaces your old GitHub username with a new one across **all your repositories and files** using the GitHub REST API.

![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🔐 **Secure Authentication** - Uses GitHub Personal Access Tokens
- 🔄 **Automated Updates** - Updates all occurrences across all repositories
- 📝 **Smart File Detection** - Targets `.md`, `.json`, `.js`, `.ts`, `.yml`, `.html`, `.css`, and more
- 🎨 **Beautiful CLI** - Colorful output with progress spinners
- 🛡️ **Safe & Dry-run Mode** - Preview changes before applying
- ⏱️ **Rate Limit Handling** - Intelligent delays to avoid API limits
- 📊 **Detailed Statistics** - See exactly what changed
- 🎯 **Selective Processing** - Skips binary files and archived repos
- 💾 **Auto Commits** - Creates meaningful commit messages

## 📋 Prerequisites

- **Node.js** v18.0.0 or higher
- **GitHub Personal Access Token** with `repo` and `read:user` scopes

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/github-username-updater.git
   cd github-username-updater
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a GitHub Personal Access Token:**
   - Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (Full control of private repositories) and `read:user`
   - Copy the generated token

4. **Configure environment variables:**
   ```bash
   # Copy the example .env file
   cp .env .env.local
   ```
   
   Edit `.env` and add your token:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   OLD_USERNAME=your-old-username
   NEW_USERNAME=your-new-username
   ```

## 🚀 Usage

### Basic Usage

```bash
node index.js --old oldUsername --new newUsername --token ghp_xxxxx
```

### Dry Run (Recommended First!)

Preview what would change without making any commits:

```bash
node index.js --old oldUsername --new newUsername --token ghp_xxxxx --dry-run
```

### Using Environment Variables

If you've set values in `.env`, you can simply run:

```bash
node index.js
```

### CLI Options

| Option | Alias | Description | Required |
|--------|-------|-------------|----------|
| `--old` | `-o` | Old GitHub username | Yes |
| `--new` | `-n` | New GitHub username | Yes |
| `--token` | `-t` | GitHub personal access token | Yes |
| `--dry-run` | `-d` | Preview changes without committing | No |
| `--help` | `-h` | Show help message | No |

## 📁 Project Structure

```
github-username-updater/
├── index.js              # Main CLI application
├── utils/
│   ├── api.js           # GitHub API wrapper with rate limiting
│   ├── replacer.js      # Text replacement logic
│   ├── logger.js        # Colorful console logger
├── .env                 # Environment variables (create this)
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
└── README.md           # Documentation
```

## 🎯 How It Works

1. **Authentication** - Verifies your GitHub token
2. **Fetch Repositories** - Gets all your repositories
3. **Scan Files** - For each repo, scans all files recursively
4. **Filter Files** - Processes only text-based files (`.md`, `.json`, `.js`, etc.)
5. **Replace Text** - Finds and replaces old username with new username
6. **Commit Changes** - Creates commits with message: `chore: updated username from oldUsername to newUsername`
7. **Rate Limiting** - Waits 1.5 seconds between repos to respect GitHub API limits

## 📊 Example Output

```
🚀 GitHub Username Auto-Updater

⚠ Running in DRY-RUN mode - no changes will be committed

✓ Authenticated as yourname
ℹ Replacing: olduser → newuser

✓ Found 25 repositories

────────────────────────────────────────────────────────
[1/25] yourname/awesome-project
────────────────────────────────────────────────────────
  ➜ README.md (3 replacements)
  ➜ package.json (2 replacements)
  ○ index.js (no changes)
ℹ Would commit 2 file(s) (dry-run)

────────────────────────────────────────────────────────
📊 Summary:
  Total repositories: 25
  ✓ Updated: 18
  ⚠ Skipped: 5
  ✗ Failed: 2
  📝 Total files changed: 47
  🔄 Total replacements: 156
────────────────────────────────────────────────────────
```

## 🛡️ Safety Features

- ✅ **Dry-run mode** - Test before applying changes
- ✅ **Skips binary files** - Only processes text files
- ✅ **Skips archived repos** - Won't modify archived repositories
- ✅ **Rate limit protection** - Automatic retry with exponential backoff
- ✅ **Case-sensitive matching** - Prevents false positives
- ✅ **Username validation** - Checks GitHub username format

## 🧪 Testing Safely

**⚠️ IMPORTANT: Always test with dry-run first!**

1. **First, run in dry-run mode:**
   ```bash
   node index.js --old testuser --new newuser --token ghp_xxx --dry-run
   ```

2. **Review the output carefully** - Check which files would be changed

3. **Test on a single repository first:**
   - Create a test repository
   - Run the tool on just that repo (you could modify the code temporarily)

4. **When confident, run without dry-run:**
   ```bash
   node index.js --old testuser --new newuser --token ghp_xxx
   ```

5. **Verify changes on GitHub** - Check a few repositories manually

## 🔍 Supported File Types

- Markdown: `.md`
- JavaScript/TypeScript: `.js`, `.ts`, `.jsx`, `.tsx`
- JSON: `.json`
- YAML: `.yml`, `.yaml`
- HTML/CSS: `.html`, `.css`
- Configuration: `.env`, `.gitignore`, `.npmrc`
- Shell scripts: `.sh`
- Text files: `.txt`
- Files without extension: `README`, `LICENSE`, `CHANGELOG`

## ⚙️ Configuration

### Rate Limiting

Default delay between repository updates: **1.5 seconds**

To modify, edit `utils/api.js`:
```javascript
this.rateLimitDelay = 1500; // milliseconds
```

### File Types

To add more file types, edit `utils/replacer.js`:
```javascript
const targetExtensions = [
  '.md', '.json', '.js', '.ts',
  '.your-new-extension'  // Add here
];
```

## 🐛 Troubleshooting

### "Authentication failed"
- Verify your token is correct
- Ensure token has `repo` and `read:user` scopes

### "Rate limit exceeded"
- The tool will automatically wait and retry
- Consider increasing `rateLimitDelay` in `utils/api.js`

### "Invalid username format"
- GitHub usernames: alphanumeric + hyphens, max 39 characters
- Cannot start/end with hyphen

### No files being updated
- Check if your username actually appears in the files
- Verify file types are supported
- Run with `--dry-run` to see what would be processed

## 📝 License

MIT License - feel free to use this in your own projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This tool makes automated changes to your repositories. Always:
- ✅ Use `--dry-run` first
- ✅ Have backups of important repositories
- ✅ Review changes before running
- ✅ Test on non-critical repos first

## 📚 Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Octokit.js](https://github.com/octokit/octokit.js)
- [Creating Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

## 💡 Tips

1. **Backup Important Repos** - Clone locally before running
2. **Start Small** - Test on a few repos first
3. **Check Commit History** - Verify commits look correct
4. **Update Local Clones** - Pull changes after running the tool

---

**Made with ❤️ by developers, for developers**

If you find this tool helpful, please give it a ⭐️!
