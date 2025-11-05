import chalk from 'chalk';

/**
 * Logger utility for colorful console output
 */
class Logger {
  /**
   * Log success message
   * @param {string} message - Success message
   */
  success(message) {
    console.log(chalk.green('✓'), message);
  }

  /**
   * Log error message
   * @param {string} message - Error message
   */
  error(message) {
    console.log(chalk.red('✗'), message);
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   */
  warn(message) {
    console.log(chalk.yellow('⚠'), message);
  }

  /**
   * Log info message
   * @param {string} message - Info message
   */
  info(message) {
    console.log(chalk.blue('ℹ'), message);
  }

  /**
   * Log file change
   * @param {string} file - File path
   * @param {number} count - Number of replacements
   */
  fileChanged(file, count) {
    console.log(chalk.cyan('  ➜'), `${file} (${count} replacement${count > 1 ? 's' : ''})`);
  }

  /**
   * Log skipped file
   * @param {string} file - File path
   */
  fileSkipped(file) {
    console.log(chalk.gray('  ○'), `${file} (no changes)`);
  }

  /**
   * Print separator line
   */
  separator() {
    console.log(chalk.gray('─'.repeat(60)));
  }

  /**
   * Print header
   * @param {string} title - Header title
   */
  header(title) {
    console.log('\n' + chalk.bold.magenta(title));
    this.separator();
  }

  /**
   * Print summary stats
   * @param {Object} stats - Statistics object
   */
  summary(stats) {
    console.log('\n');
    this.separator();
    console.log(chalk.bold.cyan('📊 Summary:'));
    console.log(chalk.white(`  Total repositories: ${stats.totalRepos}`));
    console.log(chalk.green(`  ✓ Updated: ${stats.updated}`));
    console.log(chalk.yellow(`  ⚠ Skipped: ${stats.skipped}`));
    console.log(chalk.red(`  ✗ Failed: ${stats.failed}`));
    console.log(chalk.cyan(`  📝 Total files changed: ${stats.filesChanged}`));
    console.log(chalk.cyan(`  🔄 Total replacements: ${stats.totalReplacements}`));
    this.separator();
  }
}

export default new Logger();
