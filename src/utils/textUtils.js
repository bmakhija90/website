// Text utility functions
export const textUtils = {
  // Truncate text to specific length with ellipsis
  truncate: (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  // Truncate to word boundary
  truncateWords: (text, maxWords = 20) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  },

  // Calculate if text needs truncation
  needsTruncation: (text, maxLength = 100) => {
    return text && text.length > maxLength;
  },

  // Get line clamp style
  getLineClampStyle: (lines = 3) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),

  // Calculate approximate height for line clamping
  getMinHeight: (lines = 3, lineHeight = 1.5) => {
    return `${lines * lineHeight}em`;
  }
};