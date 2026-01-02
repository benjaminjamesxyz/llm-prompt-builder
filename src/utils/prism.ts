import DOMPurify from 'dompurify';

const purifyConfig = {
  ALLOWED_TAGS: ['span', 'br', 'code', 'pre'],
  ALLOWED_ATTR: ['class'],
  KEEP_CONTENT: true
};

const formatToLangMap: Record<string, string> = {
  xml: 'xml',
  md: 'markdown',
  toon: 'yaml',
  json: 'json',
  yaml: 'yaml'
};

const memoCache = new Map<string, string>();

export const clearHighlightCache = (): void => {
  memoCache.clear();
};

export const highlightCode = (code: string, format: string): string => {
  const cacheKey = `${format}:${code.length}:${code.slice(0, 50)}`;

  const cached = memoCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const lang = formatToLangMap[format] ?? 'plain';
  const Prism = (window as any).Prism;
  const grammar = Prism.languages[lang] ?? Prism.languages.plain;
  const highlighted = Prism.highlight(code, grammar, lang);
  const sanitized = DOMPurify.sanitize(highlighted, purifyConfig);

  if (memoCache.size > 100) {
    const firstKey = memoCache.keys().next().value;
    if (firstKey) {
      memoCache.delete(firstKey);
    }
  }

  memoCache.set(cacheKey, sanitized);
  return sanitized;
};
