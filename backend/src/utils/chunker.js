/**
 * Recursive character-based text chunker.
 * Aims to split large text into smaller chunks while preserving boundaries like 
 * double newlines (paragraphs), single newlines, or spaces.
 */
class Chunker {
  /**
   * Splits text into chunks of roughly maxChunkSize.
   * @param {string} text - The raw text to split.
   * @param {number} maxChunkSize - Maximum characters per chunk.
   * @returns {string[]} An array of text chunks.
   */
  static splitText(text, maxChunkSize = 5000) {
    if (!text || text.length <= maxChunkSize) return [text];

    const chunks = [];
    let currentText = text;

    while (currentText.length > 0) {
      if (currentText.length <= maxChunkSize) {
        chunks.push(currentText);
        break;
      }

      // Try to find a good split point in the last 20% of the chunk window
      let splitIndex = maxChunkSize;
      const lookback = Math.floor(maxChunkSize * 0.2);
      const windowStart = maxChunkSize - lookback;
      const window = currentText.substring(windowStart, maxChunkSize + 100); // look slightly ahead too

      // Priority 1: Double Newline (Paragraph)
      let found = window.lastIndexOf('\n\n');
      if (found !== -1) {
        splitIndex = windowStart + found;
      } else {
        // Priority 2: Single Newline
        found = window.lastIndexOf('\n');
        if (found !== -1) {
          splitIndex = windowStart + found;
        } else {
          // Priority 3: Space
          found = window.lastIndexOf(' ');
          if (found !== -1) {
            splitIndex = windowStart + found;
          }
        }
      }

      chunks.push(currentText.substring(0, splitIndex).trim());
      currentText = currentText.substring(splitIndex).trim();
    }

    return chunks;
  }
}

module.exports = Chunker;
