#!/usr/bin/env node

import 'dotenv/config';
import minimist from 'minimist';
import ora from 'ora';
import chalk from 'chalk';
import GitHubAPI from './utils/api.js';
import logger from './utils/logger.js';
import { shouldProcessFile, replaceUsername, isValidUsername } from './utils/replacer.js';

/**
 * Main application class
 */
class GitHubUsernameUpdater {
  constructor(options) {
    this.oldUsername = options.old;
    this.newUsername = options.new;
    this.token = options.token;
    this.dryRun = options.dryRun || false;
    this.api = new GitHubAPI(this.token);
    
    // Statistics
    this.stats = {
      totalRepos: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      filesChanged: 0,
      totalReplacements: 0
    };
  }

  /**
   * Validate input parameters
   */
  validate() {
    if (!this.oldUsername || !this.newUsername) {
      throw new Error('Both --old and --new username parameters are required');
    }

    if (!this.token) {
      throw new Error('GitHub token is required (--token or GITHUB_TOKEN in .env)');
    }

    if (!isValidUsername(this.oldUsername)) {
      throw new Error(`Invalid old username format: ${this.oldUsername}`);
    }

    if (!isValidUsername(this.newUsername)) {
      throw new Error(`Invalid new username format: ${this.newUsername}`);
    }

    if (this.oldUsername === this.newUsername) {
      throw new Error('Old and new usernames cannot be the same');
    }
  }

  /**
   * Start the update process
   */
  async run() {
    try {
      // Print header
      console.log(chalk.bold.cyan('\n🚀 GitHub Username Auto-Updater\n'));
      
      if (this.dryRun) {
        logger.warn('Running in DRY-RUN mode - no changes will be committed\n');
      }

      // Validate inputs
      this.validate();

      // Verify authentication
      const spinner = ora('Authenticating with GitHub...').start();
      const user = await this.api.verifyAuth();
      spinner.succeed(`Authenticated as ${chalk.bold(user.login)}`);

      logger.info(`Replacing: ${chalk.red(this.oldUsername)} → ${chalk.green(this.newUsername)}\n`);

      // Fetch all repositories
      spinner.start('Fetching repositories...');
      const repos = await this.api.getAllRepos();
      this.stats.totalRepos = repos.length;
      spinner.succeed(`Found ${chalk.bold(repos.length)} repositories\n`);

      // Process each repository
      for (let i = 0; i < repos.length; i++) {
        const repo = repos[i];
        await this.processRepository(repo, i + 1, repos.length);
        
        // Rate limit delay between repos
        if (i < repos.length - 1) {
          await this.api.sleep(this.api.getRateLimitDelay());
        }
      }

      // Print summary
      logger.summary(this.stats);

      if (this.dryRun) {
        logger.info('\n💡 This was a dry run. Use without --dry-run to apply changes.');
      } else {
        logger.success('\n✨ All done! Your username has been updated across all repositories.');
      }

    } catch (error) {
      logger.error(`\n❌ Fatal error: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Process a single repository
   * @param {Object} repo - Repository object
   * @param {number} current - Current repo number
   * @param {number} total - Total repos
   */
  async processRepository(repo, current, total) {
    logger.header(`[${current}/${total}] ${repo.full_name}`);

    const spinner = ora('Scanning files...').start();

    try {
      // Skip archived and fork repos (optional, can be configured)
      if (repo.archived) {
        spinner.warn(`Skipped (archived repository)`);
        this.stats.skipped++;
        return;
      }

      // Get all files in the repository
      const tree = await this.api.getRepoTree(repo.owner.login, repo.name);
      const filesToProcess = tree.filter(file => shouldProcessFile(file.path));

      spinner.text = `Found ${filesToProcess.length} processable files`;

      if (filesToProcess.length === 0) {
        spinner.info('No processable files found');
        this.stats.skipped++;
        return;
      }

      spinner.stop();

      let repoHasChanges = false;
      const changedFiles = [];

      // Process each file
      for (const file of filesToProcess) {
        try {
          const fileData = await this.api.getFileContent(
            repo.owner.login,
            repo.name,
            file.path
          );

          if (!fileData) {
            logger.fileSkipped(file.path);
            continue;
          }

          // Replace username
          const { newContent, count } = replaceUsername(
            fileData.content,
            this.oldUsername,
            this.newUsername
          );

          if (count > 0) {
            repoHasChanges = true;
            this.stats.filesChanged++;
            this.stats.totalReplacements += count;
            logger.fileChanged(file.path, count);

            changedFiles.push({
              path: file.path,
              sha: fileData.sha,
              content: newContent,
              count
            });
          } else {
            logger.fileSkipped(file.path);
          }

          // Small delay between file operations
          await this.api.sleep(300);

        } catch (error) {
          logger.error(`Failed to process ${file.path}: ${error.message}`);
        }
      }

      // Commit changes if not in dry-run mode
      if (repoHasChanges && !this.dryRun) {
        spinner.start('Committing changes...');

        try {
          const commitMessage = `chore: updated username from ${this.oldUsername} to ${this.newUsername}`;

          for (const file of changedFiles) {
            await this.api.updateFile(
              repo.owner.login,
              repo.name,
              file.path,
              file.content,
              file.sha,
              commitMessage
            );

            // Delay between commits
            await this.api.sleep(500);
          }

          spinner.succeed(`✓ Committed ${changedFiles.length} file(s)`);
          this.stats.updated++;
        } catch (error) {
          spinner.fail(`Failed to commit: ${error.message}`);
          this.stats.failed++;
        }
      } else if (repoHasChanges && this.dryRun) {
        logger.info(`Would commit ${changedFiles.length} file(s) (dry-run)`);
        this.stats.updated++;
      } else {
        logger.info('No changes needed');
        this.stats.skipped++;
      }

    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
      this.stats.failed++;
    }

    console.log(''); // Empty line for readability
  }
}

/**
 * Parse CLI arguments and run the updater
 */
function main() {
  const args = minimist(process.argv.slice(2), {
    string: ['old', 'new', 'token'],
    boolean: ['dry-run', 'help'],
    alias: {
      o: 'old',
      n: 'new',
      t: 'token',
      d: 'dry-run',
      h: 'help'
    }
  });

  // Show help
  if (args.help) {
    console.log(chalk.cyan.bold('\n📚 GitHub Username Auto-Updater - Help\n'));
    console.log('Usage: node index.js [options]\n');
    console.log('Options:');
    console.log('  --old, -o        Old GitHub username (required)');
    console.log('  --new, -n        New GitHub username (required)');
    console.log('  --token, -t      GitHub personal access token (required)');
    console.log('  --dry-run, -d    Preview changes without committing');
    console.log('  --help, -h       Show this help message\n');
    console.log('Example:');
    console.log('  node index.js --old olduser --new newuser --token ghp_xxx --dry-run\n');
    console.log('Environment variables (in .env):');
    console.log('  GITHUB_TOKEN     GitHub personal access token');
    console.log('  OLD_USERNAME     Default old username');
    console.log('  NEW_USERNAME     Default new username\n');
    process.exit(0);
  }

  // Get values from CLI args or environment variables
  const options = {
    old: args.old || process.env.OLD_USERNAME,
    new: args.new || process.env.NEW_USERNAME,
    token: args.token || process.env.GITHUB_TOKEN,
    dryRun: args['dry-run']
  };

  // Run the updater
  const updater = new GitHubUsernameUpdater(options);
  updater.run();
}

// Execute
main();
