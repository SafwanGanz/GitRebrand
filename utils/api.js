import { Octokit } from '@octokit/rest';
import logger from './logger.js';

/**
 * GitHub API wrapper with rate limit handling
 */
class GitHubAPI {
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
    this.rateLimitDelay = 1500; // 1.5 seconds between requests
  }

  /**
   * Verify authentication and get user info
   * @returns {Promise<Object>} - User data
   */
  async verifyAuth() {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      return data;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Get all repositories for the authenticated user
   * @returns {Promise<Array>} - Array of repositories
   */
  async getAllRepos() {
    try {
      const repos = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const { data } = await this.octokit.repos.listForAuthenticatedUser({
          per_page: 100,
          page,
          sort: 'updated',
          direction: 'desc'
        });

        repos.push(...data);
        hasMore = data.length === 100;
        page++;

        // Rate limit protection
        if (hasMore) {
          await this.sleep(this.rateLimitDelay);
        }
      }

      return repos;
    } catch (error) {
      await this.handleRateLimit(error);
      throw error;
    }
  }

  /**
   * Get repository tree (all files)
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} branch - Branch name (default: main/master)
   * @returns {Promise<Array>} - Array of files
   */
  async getRepoTree(owner, repo, branch = 'main') {
    try {
      // First, get the default branch
      const { data: repoData } = await this.octokit.repos.get({ owner, repo });
      const defaultBranch = repoData.default_branch;

      // Get the tree
      const { data } = await this.octokit.git.getTree({
        owner,
        repo,
        tree_sha: defaultBranch,
        recursive: 'true'
      });

      return data.tree.filter(item => item.type === 'blob');
    } catch (error) {
      await this.handleRateLimit(error);
      throw error;
    }
  }

  /**
   * Get file content from repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - File path
   * @returns {Promise<Object>} - File data { content, sha }
   */
  async getFileContent(owner, repo, path) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path
      });

      // GitHub returns base64 encoded content
      if (data.encoding === 'base64') {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
          content,
          sha: data.sha,
          encoding: data.encoding
        };
      }

      return null;
    } catch (error) {
      await this.handleRateLimit(error);
      throw error;
    }
  }

  /**
   * Update file content in repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - File path
   * @param {string} content - New file content
   * @param {string} sha - Current file SHA
   * @param {string} message - Commit message
   * @returns {Promise<Object>} - Commit data
   */
  async updateFile(owner, repo, path, content, sha, message) {
    try {
      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        sha
      });

      return data;
    } catch (error) {
      await this.handleRateLimit(error);
      throw error;
    }
  }

  /**
   * Handle rate limit errors
   * @param {Error} error - Error object
   */
  async handleRateLimit(error) {
    if (error.status === 403 && error.response?.headers?.['x-ratelimit-remaining'] === '0') {
      const resetTime = error.response.headers['x-ratelimit-reset'];
      const waitTime = (resetTime * 1000) - Date.now();
      
      logger.warn(`Rate limit exceeded. Waiting ${Math.ceil(waitTime / 1000 / 60)} minutes...`);
      await this.sleep(waitTime + 1000);
    }
  }

  /**
   * Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get rate limit delay
   * @returns {number} - Delay in milliseconds
   */
  getRateLimitDelay() {
    return this.rateLimitDelay;
  }
}

export default GitHubAPI;
