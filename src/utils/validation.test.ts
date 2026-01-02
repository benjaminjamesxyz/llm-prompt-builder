import { describe, it, expect } from 'vitest';
import { validateFileSize, safeJsonParse, validateNode, sanitizeTagInput, ValidationError } from '../utils/validation';

describe('Validation Utils', () => {
  describe('validateFileSize', () => {
    it('should pass validation for files under 500KB', () => {
      const file = new File(['content'], 'test.json', { type: 'application/json' });
      const result = validateFileSize(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should fail validation for files over 500KB', () => {
      const largeContent = 'x'.repeat(500 * 1024 + 1);
      const file = new File([largeContent], 'large.json', { type: 'application/json' });
      const result = validateFileSize(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(ValidationError.FILE_TOO_LARGE);
    });

    it('should pass validation for exactly 500KB file', () => {
      const exactContent = 'x'.repeat(500 * 1024);
      const file = new File([exactContent], 'exact.json', { type: 'application/json' });
      const result = validateFileSize(file);
      expect(result.valid).toBe(true);
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const json = '{"key":"value"}';
      const result = safeJsonParse<{ key: string }>(json);
      expect(result.data).toEqual({ key: 'value' });
      expect(result.error).toBeUndefined();
    });

    it('should fail on invalid JSON', () => {
      const json = 'not valid json';
      const result = safeJsonParse(json);
      expect(result.data).toBeNull();
      expect(result.error).toBe(ValidationError.INVALID_JSON);
    });

    it('should protect against prototype pollution', () => {
      const json = '{"__proto__":{"polluted":true}}';
      const result = safeJsonParse(json);
      expect(result.data).toBeNull();
      expect(result.error).toBe(ValidationError.INVALID_SCHEMA);
    });
  });

  describe('validateNode', () => {
    it('should validate a valid node', () => {
      const node = {
        id: 'test-id',
        tag: 'SYSTEM',
        content: 'test content'
      };
      const result = validateNode(node);
      expect(result.valid).toBe(true);
      expect(result.node).toEqual({ ...node, children: [] });
    });

    it('should fail validation for missing id', () => {
      const node = {
        tag: 'SYSTEM',
        content: 'test'
      };
      const result = validateNode(node);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(ValidationError.INVALID_SCHEMA);
    });

    it('should fail validation for missing tag', () => {
      const node = {
        id: 'test-id',
        content: 'test'
      };
      const result = validateNode(node);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(ValidationError.INVALID_SCHEMA);
    });

    it('should fail validation for invalid content type', () => {
      const node = {
        id: 'test-id',
        tag: 'SYSTEM',
        content: 123
      };
      const result = validateNode(node);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(ValidationError.INVALID_SCHEMA);
    });

    it('should validate node with children array', () => {
      const node = {
        id: 'test-id',
        tag: 'SYSTEM',
        content: 'test',
        children: [
          { id: 'child-id', tag: 'ITEM', content: 'child' }
        ]
      };
      const result = validateNode(node);
      expect(result.valid).toBe(true);
    });

    it('should fail validation for non-array children', () => {
      const node = {
        id: 'test-id',
        tag: 'SYSTEM',
        content: 'test',
        children: 'not an array'
      };
      const result = validateNode(node);
      expect(result.valid).toBe(false);
      expect(result.error).toBe(ValidationError.INVALID_SCHEMA);
    });
  });

  describe('sanitizeTagInput', () => {
    it('should remove HTML tags', () => {
      const result = sanitizeTagInput('<script>alert("xss")</script>SYSTEM');
      expect(result).toBe('alertxssSYSTEM');
    });

    it('should remove event handlers', () => {
      const result = sanitizeTagInput('onClick=alert(1)SYSTEM');
      expect(result).toBe('alert1SYSTEM');
    });

    it('should replace spaces with underscores', () => {
      const result = sanitizeTagInput('SYSTEM TAG');
      expect(result).toBe('SYSTEM_TAG');
    });

    it('should remove special characters', () => {
      const result = sanitizeTagInput('SYSTEM@#$TAG');
      expect(result).toBe('SYSTEMTAG');
    });

    it('should keep allowed characters', () => {
      const result = sanitizeTagInput('System_Tag-123');
      expect(result).toBe('System_Tag-123');
    });

    it('should handle empty input', () => {
      const result = sanitizeTagInput('');
      expect(result).toBe('');
    });

    it('should trim whitespace', () => {
      const result = sanitizeTagInput('  SYSTEM  ');
      expect(result).toBe('_SYSTEM_');
    });
  });
});
