import { describe, it, expect } from 'vitest';
import { toXML, toObjectTree, toTOON, toMarkdown } from '../utils/formatters';
import { Node } from '../types';

describe('Formatters', () => {
  const simpleNode: Node = {
    id: 'test-1',
    tag: 'SYSTEM',
    content: 'You are a helpful assistant.'
  };

  const nodeWithChildren: Node = {
    id: 'test-2',
    tag: 'SYSTEM',
    content: '',
    children: [
      { id: 'child-1', tag: 'INSTRUCTION', content: 'Be concise' },
      { id: 'child-2', tag: 'EXAMPLE', content: 'Example response' }
    ]
  };

  describe('toXML', () => {
    it('should format simple node as XML', () => {
      const result = toXML([simpleNode]);
      expect(result).toBe('<SYSTEM>You are a helpful assistant.</SYSTEM>');
    });

    it('should format node with children as nested XML', () => {
      const result = toXML([nodeWithChildren]);
      expect(result).toContain('<SYSTEM>');
      expect(result).toContain('<INSTRUCTION>Be concise</INSTRUCTION>');
      expect(result).toContain('<EXAMPLE>Example response</EXAMPLE>');
    });

    it('should handle multiline content', () => {
      const multilineNode: Node = {
        id: 'test-3',
        tag: 'SYSTEM',
        content: 'Line 1\nLine 2\nLine 3'
      };
      const result = toXML([multilineNode]);
      expect(result).toContain('Line 1');
      expect(result).toContain('Line 2');
      expect(result).toContain('Line 3');
    });

    it('should handle multiple nodes', () => {
      const result = toXML([
        { id: 'a', tag: 'SYSTEM', content: 'First' },
        { id: 'b', tag: 'USER', content: 'Second' }
      ]);
      expect(result).toContain('<SYSTEM>First</SYSTEM>');
      expect(result).toContain('<USER>Second</USER>');
    });
  });

  describe('toObjectTree', () => {
    it('should convert simple node to object', () => {
      const result = toObjectTree([simpleNode]);
      expect(result).toEqual({ SYSTEM: 'You are a helpful assistant.' });
    });

    it('should convert node with children to nested object', () => {
      const result = toObjectTree([nodeWithChildren]);
      expect(result).toHaveProperty('SYSTEM');
      expect(result.SYSTEM).toHaveProperty('INSTRUCTION', 'Be concise');
      expect(result.SYSTEM).toHaveProperty('EXAMPLE', 'Example response');
    });

    it('should merge duplicate keys into array', () => {
      const nodes: Node[] = [
        { id: 'a', tag: 'SYSTEM', content: 'First' },
        { id: 'b', tag: 'SYSTEM', content: 'Second' }
      ];
      const result = toObjectTree(nodes);
      expect(result.SYSTEM).toEqual(['First', 'Second']);
    });
  });

  describe('toMarkdown', () => {
    it('should format simple node as Markdown', () => {
      const result = toMarkdown([simpleNode]);
      expect(result).toBe('# SYSTEM\nYou are a helpful assistant.\n\n');
    });

    it('should format nested nodes with proper headers', () => {
      const result = toMarkdown([nodeWithChildren]);
      expect(result).toContain('# SYSTEM');
      expect(result).toContain('## INSTRUCTION');
      expect(result).toContain('Be concise');
      expect(result).toContain('## EXAMPLE');
      expect(result).toContain('Example response');
    });

    it('should handle multiple top-level nodes', () => {
      const nodes: Node[] = [
        { id: 'a', tag: 'SYSTEM', content: 'System msg' },
        { id: 'b', tag: 'USER', content: 'User msg' }
      ];
      const result = toMarkdown(nodes);
      expect(result).toContain('# SYSTEM\nSystem msg');
      expect(result).toContain('# USER\nUser msg');
    });
  });

  describe('toTOON', () => {
    it('should format simple node as TOON', () => {
      const result = toTOON([simpleNode]);
      expect(result).toContain('SYSTEM:');
      expect(result).toContain('You are a helpful assistant.');
    });

    it('should format leaf children in array syntax', () => {
      const node: Node = {
        id: 'test',
        tag: 'ITEMS',
        content: '',
        children: [
          { id: 'a', tag: 'ITEM', content: 'First' },
          { id: 'b', tag: 'ITEM', content: 'Second' }
        ]
      };
      const result = toTOON([node]);
      expect(result).toContain('ITEMS[2]:');
      expect(result).toContain('First,Second');
    });

    it('should handle content with commas by quoting', () => {
      const node: Node = {
        id: 'test',
        tag: 'ITEMS',
        content: '',
        children: [
          { id: 'a', tag: 'ITEM', content: 'First, with comma' },
          { id: 'b', tag: 'ITEM', content: 'Second' }
        ]
      };
      const result = toTOON([node]);
      expect(result).toContain('"First, with comma"');
    });
  });
});
