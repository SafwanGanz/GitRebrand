/**
 * Utility functions for text replacement
 */

/**
 * Check if a file should be processed based on its extension
 * @param {string} filename - Name of the file
 * @returns {boolean} - True if file should be processed
 */
export function shouldProcessFile(filename) {
  const targetExtensions = [
    '.md', '.json', '.js', '.ts', '.jsx', '.tsx',
    '.yml', '.yaml', '.html', '.css', '.txt',
    '.env', '.gitignore', '.npmrc', '.sh'
  ];

  // Files without extension (like README, LICENSE)
  if (!filename.includes('.')) {
    const noExtFiles = ['README', 'LICENSE', 'CHANGELOG', 'CONTRIBUTING'];
    return noExtFiles.some(name => filename.toUpperCase().includes(name));
  }

  return targetExtensions.some(ext => filename.toLowerCase().endsWith(ext));
}

/**
 * Replace all occurrences of old username with new username
 * @param {string} content - File content
 * @param {string} oldUsername - Old GitHub username
 * @param {string} newUsername - New GitHub username
 * @returns {Object} - { newContent, count }
 */
export function replaceUsername(content, oldUsername, newUsername) {
  // Case-sensitive replacement to avoid false positives
  const regex = new RegExp(escapeRegExp(oldUsername), 'g');
  
  let count = 0;
  const newContent = content.replace(regex, (match) => {
    count++;
    return newUsername;
  });

  return { newContent, count };
}

/**
 * Escape special regex characters in a string
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if content is likely binary
 * @param {string} content - File content (base64 encoded)
 * @returns {boolean} - True if content appears to be binary
 */
export function isBinaryContent(content) {
  // This is a simplified check - GitHub API provides encoding info
  // which we use in the main logic
  return false;
}

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
export function isValidUsername(username) {
  // GitHub username rules: alphanumeric + hyphens, max 39 chars
  const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  return regex.test(username);
}
