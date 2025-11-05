# Changelog

All notable changes to the GitHub Username Auto-Updater project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-05

### Added
- Initial release of GitHub Username Auto-Updater
- Automatic username replacement across all repositories
- Support for multiple file types (.md, .json, .js, .ts, .yml, .html, .css, etc.)
- Dry-run mode for safe testing before applying changes
- Beautiful CLI with colored output using chalk
- Progress spinners using ora
- Comprehensive error handling and validation
- Rate limit protection with automatic retry
- Smart file detection (skips binary files)
- Automatic skipping of archived repositories
- Detailed statistics and summary reports
- CLI argument parsing with minimist
- Environment variable support via dotenv
- GitHub API integration using Octokit
- Username format validation
- Case-sensitive replacement to avoid false positives
- Meaningful commit messages
- Comprehensive documentation (README, QUICKSTART, TESTING)
- MIT License

### Features
- `--dry-run` flag for preview mode
- `--help` flag for usage information
- `--old` parameter for old username
- `--new` parameter for new username
- `--token` parameter for GitHub PAT
- Support for CLI arguments and .env configuration
- 1.5-second delay between repository updates
- Automatic retry on rate limit errors
- File-by-file processing with progress tracking
- Atomic commits per file

### Documentation
- Complete README.md with installation and usage
- QUICKSTART.md for fast setup
- TESTING.md with comprehensive testing guide
- Inline code comments explaining key logic
- Example .env file
- MIT LICENSE file

### Security
- Token-based authentication only
- No storage of credentials
- Scope validation (repo, read:user)
- Safe file handling (preserves encoding)

## [Unreleased]

### Planned Features
- Support for organization repositories
- Batch commit mode (commit all changes at once)
- Exclude patterns for files/directories
- Custom commit message templates
- Progress bar for large repositories
- Parallel processing with concurrency limits
- Undo/rollback functionality
- Configuration file support (.updaterrc)
- Interactive mode with confirmation prompts
- Statistics export (JSON/CSV)

---

For more information, see the [README](README.md).
