import { Node } from '../types';
import { uuid } from './uuid';

type NodeUpdate = Partial<Node>;
type NodeTransform = (node: Node) => Node;

export const updateNodeInTree = (nodes: Node[], id: string, changes: NodeUpdate): Node[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, ...changes };
    }
    if (node.children?.length) {
      return { ...node, children: updateNodeInTree(node.children, id, changes) };
    }
    return node;
  });
};

export const deleteNodeFromTree = (nodes: Node[], id: string): Node[] => {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: node.children?.length ? deleteNodeFromTree(node.children, id) : undefined
    }));
};

export const moveNodeInList = (nodes: Node[], index: number, direction: number): Node[] => {
  if (index + direction < 0 || index + direction >= nodes.length) {
    return nodes;
  }
  const newNodes = [...nodes];
  const temp = newNodes[index];
  newNodes[index] = newNodes[index + direction];
  newNodes[index + direction] = temp;
  return newNodes;
};

export const addChildToNode = (nodes: Node[], parentId: string, child: Node): Node[] => {
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...(node.children || []), child]
      };
    }
    if (node.children?.length) {
      return { ...node, children: addChildToNode(node.children, parentId, child) };
    }
    return node;
  });
};

export const transformNodeTree = (nodes: Node[], transform: NodeTransform): Node[] => {
  return nodes.map(node => {
    const transformed = transform(node);
    if (transformed.children?.length) {
      return { ...transformed, children: transformNodeTree(transformed.children, transform) };
    }
    return transformed;
  });
};

export const regenerateNodeIds = (nodes: Node[]): Node[] => {
  return transformNodeTree(nodes, node => ({ ...node, id: uuid() }));
};

export const createEmptyNode = (tag: string = 'BLOCK', content: string = ''): Node => ({
  id: uuid(),
  tag,
  content,
  children: []
});

export const createChildNode = (content: string = ''): Node => ({
  id: uuid(),
  tag: 'SUB_BLOCK',
  content,
  children: []
});

export const createItemNode = (content: string = ''): Node => ({
  id: uuid(),
  tag: 'ITEM',
  content,
  children: []
});

export const findNodeById = (nodes: Node[], id: string): Node | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const countNodes = (nodes: Node[]): number => {
  return nodes.reduce((count, node) => {
    return count + 1 + (node.children?.length ? countNodes(node.children) : 0);
  }, 0);
};

export const getDepth = (node: Node): number => {
  if (!node.children?.length) return 0;
  return 1 + Math.max(...node.children.map(getDepth));
};
