import { Node } from '../types';
import { MAX_FILE_SIZE_BYTES } from '../constants';

export enum ValidationError {
  FILE_TOO_LARGE = 'ERR_FILE_SIZE',
  INVALID_JSON = 'ERR_INVALID_JSON',
  INVALID_SCHEMA = 'ERR_INVALID_SCHEMA',
  INVALID_TAG = 'ERR_INVALID_TAG',
  PARSE_ERROR = 'ERR_PARSE'
}

export const validateFileSize = (file: File): { valid: boolean; error?: ValidationError } => {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: ValidationError.FILE_TOO_LARGE
    };
  }
  return { valid: true };
};

export const safeJsonParse = <T>(json: string): { data: T | null; error?: ValidationError } => {
  try {
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      if (Object.prototype.hasOwnProperty.call(parsed, '__proto__')) {
        return { data: null, error: ValidationError.INVALID_SCHEMA };
      }
    }
    return { data: parsed as T };
  } catch {
    return { data: null, error: ValidationError.INVALID_JSON };
  }
};

export const validateNode = (data: unknown): { valid: boolean; node?: Node; error?: ValidationError } => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  const obj = data as Record<string, unknown>;
  if (!obj.id || typeof obj.id !== 'string') {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  if (!obj.tag || typeof obj.tag !== 'string') {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  if (obj.content !== undefined && typeof obj.content !== 'string') {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  if (obj.children !== undefined && !Array.isArray(obj.children)) {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }
  const validNode: Node = {
    id: obj.id as string,
    tag: obj.tag as string,
    content: (obj.content as string) ?? '',
    children: (obj.children as Node[]) ?? []
  };
  return { valid: true, node: validNode };
};

export const validateNodes = (nodes: unknown): { valid: boolean; nodes?: Node[]; error?: ValidationError } => {
  if (!Array.isArray(nodes)) {
    return { valid: false, error: ValidationError.INVALID_SCHEMA };
  }

  const validatedNodes: Node[] = [];
  for (const node of nodes) {
    const result = validateNode(node);
    if (!result.valid) {
      return { valid: false, error: ValidationError.INVALID_SCHEMA };
    }
    validatedNodes.push(result.node!);
  }
  return { valid: true, nodes: validatedNodes };
};

export const sanitizeTagInput = (input: string): string => {
  let sanitized = input.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  sanitized = sanitized.replace(/\s+/g, '_');
  sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, '');
  return sanitized.trim();
};

export const sanitizeContent = (content: string): string => {
  return content;
};
