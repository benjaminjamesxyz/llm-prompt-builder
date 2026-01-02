import DOMPurify from 'dompurify';

// Configure DOMPurify to preserve syntax highlighting
const purifyConfig = {
  ALLOWED_TAGS: ['span', 'br', 'code', 'pre'],
  ALLOWED_ATTR: ['class'],
  KEEP_CONTENT: true
};

// Track loading states for different formats
const formatLoadingStates = new Map<string, boolean>();

export const highlightCode = (code: string, format: string): string => {
  // Check if Prism is available
  if (typeof (window as any).Prism === 'undefined') {
    // Mark this format as needing Prism
    formatLoadingStates.set(format, true);
    return code;
  }
  
  let lang = format;
  if (format === 'xml') lang = 'xml';
  if (format === 'md') lang = 'markdown';
  if (format === 'toon') lang = 'yaml';
  
  const Prism = (window as any).Prism;
  const grammar = Prism.languages[lang] || Prism.languages.plain;
  const highlighted = Prism.highlight(code, grammar, lang);
  
  // Sanitize with DOMPurify for defense-in-depth
  return DOMPurify.sanitize(highlighted, purifyConfig);
};

// Export loading state for UI components
export const getFormatLoadingState = (format: string): boolean => {
  return formatLoadingStates.get(format) || false;
};

// Clear loading state when format changes
export const clearFormatLoadingState = (format: string) => {
  formatLoadingStates.delete(format);
};
