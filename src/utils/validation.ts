// Maximum file size: 500KB (user preference)
const MAX_FILE_SIZE_BYTES = 500 * 1024;

// Error codes for detailed error messages
export enum ValidationError {
  FILE_TOO_LARGE = 'ERR_FILE_SIZE',
  INVALID_JSON = 'ERR_INVALID_JSON',
  INVALID_SCHEMA = 'ERR_INVALID_SCHEMA',
  INVALID_TAG = 'ERR_INVALID_TAG',
  PARSE_ERROR = 'ERR_PARSE'
}

// Validate file size (500KB limit)
export const validateFileSize = (file: File): { valid: boolean; error?: ValidationError } => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      error: ValidationError.FILE_TOO_LARGE 
    };
  }
  return { valid: true };
};

// Safe JSON parsing with error codes
export const safeJsonParse = <T>(json: string): { data: T | null; error?: ValidationError } => {
  try {
    const parsed = JSON.parse(json);
    // Basic prototype pollution protection
    if (parsed.__proto__ || parsed.constructor !== Object) {
      return { data: null, error: ValidationError.INVALID_SCHEMA };
    }
    return { data: parsed };
  } catch (err) {
    return { data: null, error: ValidationError.INVALID_JSON };
  }
};

// Schema validation for Node objects
export const validateNode = (data: any): { valid: boolean; node?: any; error?: ValidationError } => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  if (!data.id || typeof data.id !== 'string') {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  if (!data.tag || typeof data.tag !== 'string') {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  if (data.content && typeof data.content !== 'string') {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  if (data.children && !Array.isArray(data.children)) {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  return { valid: true, node: data };
};

// Validate multiple nodes (for file uploads)
export const validateNodes = (nodes: any[]): { valid: boolean; nodes?: any[]; error?: ValidationError } => {
  if (!Array.isArray(nodes)) {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  
  const validatedNodes: any[] = [];
  for (const node of nodes) {
    const result = validateNode(node);
    if (!result.valid) {
      return { valid: false, error: ValidationError.INVALID_SCHEMA };
    }
    validatedNodes.push(result.node!);
  }
  return { valid: true, nodes: validatedNodes };
};

// Sanitize tag input to prevent HTML injection
export const sanitizeTagInput = (input: string): string => {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  // Remove script/event handler attributes
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  // Replace spaces with underscores
  sanitized = sanitized.replace(/\s+/g, '_');
  // Remove special characters except underscore, hyphen, alphanumeric
  sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '');
  return sanitized.trim();
};

// Sanitize text content (basic protection)
export const sanitizeContent = (content: string): string => {
  // Don't sanitize for prompt builder use case
  // Users need to enter arbitrary text
  return content;
};
