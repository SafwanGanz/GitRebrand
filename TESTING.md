# 🧪 Testing Guide

## How to Test Safely

### Phase 1: Validation Testing (No GitHub API calls)

Test the CLI argument parsing and validation:

```bash
# Test help command
node index.js --help

# Test missing parameters (should show error)
node index.js

# Test invalid username format (should show error)
node index.js --old "invalid user" --new "test-user" --token test

# Test same username (should show error)
node index.js --old testuser --new testuser --token test
```

### Phase 2: Dry Run Testing (Safe - No Changes)

**Prerequisites:**
1. Create a GitHub Personal Access Token
2. Have at least one test repository

```bash
# Set up .env file first
GITHUB_TOKEN=ghp_your_actual_token
OLD_USERNAME=your-old-username
NEW_USERNAME=your-new-username

# Run dry-run mode
node index.js --dry-run
```

**Expected Output:**
- ✅ Successful authentication
- ✅ List of repositories found
- ✅ Files that would be changed
- ✅ Number of replacements per file
- ✅ "This was a dry run" message at the end

**What to Check:**
- [ ] Token authentication works
- [ ] All repositories are listed
- [ ] File detection is accurate
- [ ] Replacement count makes sense
- [ ] No actual commits were made (check GitHub)

### Phase 3: Test Repository (Recommended)

Create a dedicated test repository to verify actual changes:

1. **Create test repo on GitHub:**
   ```bash
   # On GitHub, create a new repository called "username-updater-test"
   ```

2. **Add test files with your old username:**
   - Create `README.md` with your old username
   - Create `package.json` with repository URL using old username
   - Create `test.js` with a comment containing old username

3. **Run on test repo only** (modify code temporarily):
   ```javascript
   // In index.js, filter repos to only process test repo:
   const repos = (await this.api.getAllRepos()).filter(r => 
     r.name === 'username-updater-test'
   );
   ```

4. **Execute with dry-run:**
   ```bash
   node index.js --dry-run
   ```

5. **Execute for real:**
   ```bash
   node index.js
   ```

6. **Verify on GitHub:**
   - Check the commit message
   - Check that files were updated correctly
   - Check that commit appears in history

### Phase 4: Full Production Run

Only after Phase 1-3 are successful:

```bash
# Final dry-run on ALL repos
node index.js --dry-run

# Review output carefully...

# Execute on all repositories
node index.js
```

## Test Scenarios

### Scenario 1: Empty Repository
- Create a repo with no files
- Should skip with "No processable files found"

### Scenario 2: Binary Files Only
- Create a repo with only images/binaries
- Should skip binary files

### Scenario 3: Archived Repository
- Archive one of your repos
- Should skip with "Skipped (archived repository)"

### Scenario 4: No Matches
- Create a repo without your username in any file
- Should show "No changes needed"

### Scenario 5: Multiple Occurrences
- Create a file with username appearing 5+ times
- Should count all replacements correctly

### Scenario 6: Case Sensitivity
- Add username in different cases: `USERNAME`, `UserName`
- Should only replace exact case matches

## Sample Test Repository Structure

```
username-updater-test/
├── README.md
│   # GitHub Username Updater Test
│   
│   Repository: https://github.com/oldusername/test
│   Author: @oldusername
│
├── package.json
│   {
│     "name": "test",
│     "repository": "https://github.com/oldusername/test"
│   }
│
├── src/
│   └── index.js
│       // Author: oldusername
│       console.log('Created by oldusername');
│
└── .github/
    └── workflows/
        └── ci.yml
            # https://github.com/oldusername/test
```

Expected replacements: 6 (all instances of `oldusername`)

## Verification Checklist

After running the tool:

- [ ] Check commit history on GitHub
- [ ] Verify commit messages are correct
- [ ] Spot-check 3-5 random files manually
- [ ] Ensure no files were corrupted
- [ ] Check that repository URLs updated correctly
- [ ] Verify package.json URLs are correct
- [ ] Test that links in README still work

## Troubleshooting Tests

### If Authentication Fails:
1. Verify token is correct (no extra spaces)
2. Check token hasn't expired
3. Verify scopes include `repo` and `read:user`
4. Try regenerating token

### If No Files Detected:
1. Check file extensions match supported types
2. Verify files contain your old username
3. Check repository isn't empty

### If Rate Limited:
1. Wait for the automatic retry
2. The tool will display wait time
3. Consider increasing delay in `utils/api.js`

## Performance Testing

Test with different repository sizes:

| Repo Size | Files | Expected Time | Notes |
|-----------|-------|---------------|-------|
| Small | 1-5 | ~10 seconds | Quick test |
| Medium | 10-50 | ~30-60 seconds | Typical project |
| Large | 100+ | ~2-5 minutes | Rate limiting kicks in |

## Safety Checks Built-In

The tool includes these automatic safety features:

✅ Validates username format
✅ Skips binary files automatically  
✅ Skips archived repositories
✅ Handles rate limits with retry
✅ Preserves file encoding
✅ Creates atomic commits per file

## Rollback Plan

If something goes wrong:

### Option 1: Git Revert (Per Repository)
```bash
cd your-repo
git log  # Find the commit hash
git revert <commit-hash>
git push
```

### Option 2: Manual Fix
Edit files manually and commit corrections

### Option 3: Restore from Backup
If you cloned repositories before running

## Recommended Test Workflow

```bash
# 1. Validation
node index.js --help
node index.js  # Should show error

# 2. Setup
# Add token to .env

# 3. Dry run
node index.js --dry-run

# 4. Review output
# Check statistics, file counts

# 5. Test repo (optional but recommended)
# Create test repo, run on it

# 6. Production dry run
node index.js --dry-run

# 7. Production run
node index.js

# 8. Verification
# Check GitHub commits
```

## Success Criteria

Your test is successful if:

✅ Dry-run shows expected files
✅ Test repository updated correctly  
✅ Commit messages are properly formatted
✅ No files were corrupted
✅ Statistics match manual count
✅ Rate limiting worked without errors
✅ All file types were processed

---

**Always start with `--dry-run`! 🛡️**
