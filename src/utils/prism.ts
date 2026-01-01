import Prism from 'prismjs';

export const highlightCode = (code: string, format: string): string => {
  if (typeof Prism === 'undefined') return code;
  
  let lang = format;
  if (format === 'xml') lang = 'xml';
  if (format === 'md') lang = 'markdown';
  if (format === 'toon') lang = 'yaml';
  
  const grammar = Prism.languages[lang] || Prism.languages.plain;
  return Prism.highlight(code, grammar, lang);
};
