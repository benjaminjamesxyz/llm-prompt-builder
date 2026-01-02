import DOMPurify from 'dompurify';

// Configure DOMPurify to preserve syntax highlighting
const purifyConfig = {
  ALLOWED_TAGS: ['span', 'br', 'code', 'pre'],
  ALLOWED_ATTR: ['class'],
  KEEP_CONTENT: true
};

export const highlightCode = (code: string, format: string): string => {
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
