import { Node } from '../types';

export const toXML = (nodes: Node[], indent = 0): string => {
  const sp = '  '.repeat(indent);
  return nodes.map(node => {
    const hasNewlines = node.content.includes('\n');
    const tag = node.tag;
    const inner = node.children && node.children.length > 0
      ? `\n${toXML(node.children, indent + 1)}\n${sp}`
      : (hasNewlines ? `\n${sp}  ${node.content.replace(/\n/g, `\n${sp}  `)}\n${sp}` : node.content);
    return `${sp}<${tag}>${inner}</${tag}>`;
  }).join('\n');
};

export const toObjectTree = (nodes: Node[]): Record<string, any> => {
  const obj: Record<string, any> = {};
  nodes.forEach(node => {
    const key = node.tag || "BLOCK";
    let value: any;
    if (node.children && node.children.length > 0) {
      value = toObjectTree(node.children);
    } else {
      value = node.content;
    }
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  });
  return obj;
};

export const toTOON = (nodes: Node[], indent = 0): string => {
  let out = "";
  const sp = '  '.repeat(indent);
  nodes.forEach(node => {
    const key = node.tag;
    if (!node.children || node.children.length === 0) {
      let val = node.content;
      if (val.includes('\n')) val = `"${val.replace(/\n/g, '\\n')}"`;
      out += `${sp}${key}: ${val}\n`;
      return;
    }
    const children = node.children;
    const count = children.length;
    const allChildrenAreLeaves = children.every(c => !c.children || c.children.length === 0);
    const allTagsIdentical = new Set(children.map(c => c.tag)).size === 1;
    if (allChildrenAreLeaves && allTagsIdentical) {
      const values = children.map(c => {
        let v = c.content;
        if (v.includes(',') || v.includes('\n')) v = `"${v.replace(/"/g, '""')}"`;
        return v;
      }).join(',');
      out += `${sp}${key}[${count}]: ${values}\n`;
      return;
    }
    const allChildrenHaveChildren = children.every(c => c.children && c.children.length > 0);
    if (allChildrenHaveChildren && allTagsIdentical) {
      const firstChild = children[0];
      const columns = firstChild.children!.map(c => c.tag);
      const originalColumnTags = firstChild.children!.map(c => c.tag);
      const headerCols = columns;
      out += `${sp}${key}[${count}]{${headerCols.join(',')}}:\n`;
      children.forEach(child => {
        const row = originalColumnTags.map(colTag => {
          const cellNode = child.children!.find(c => c.tag === colTag);
          let val = cellNode ? cellNode.content : "";
          if (val === "true" || val === "false") return val;
          if (!isNaN(Number(val)) && val.trim() !== "") return val;
          if (val.includes(',') || val.includes('\n') || val.includes('"')) {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        });
        out += `${sp}  ${row.join(',')}\n`;
      });
      return;
    }
    out += `${sp}${key}:\n`;
    out += toTOON(children, indent + 1);
  });
  return out;
};

export const toMarkdown = (nodes: Node[], level = 1): string => {
  return nodes.map(node => {
    const header = '#'.repeat(level);
    let text = `${header} ${node.tag}\n`;
    if (node.content) text += `${node.content}\n\n`;
    if (node.children && node.children.length > 0) {
      text += toMarkdown(node.children, level + 1);
    }
    return text;
  }).join('');
};
