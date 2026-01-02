import { useCallback } from 'preact/hooks';
import { Node } from '../types';
import {
  updateNodeInTree,
  deleteNodeFromTree,
  moveNodeInList,
  addChildToNode,
  createChildNode
} from '../utils/nodeOperations';

export const useNodeOperations = (nodes: Node[], setNodes: (nodes: Node[]) => void) => {
  const updateNode = useCallback((id: string, changes: Partial<Node>) => {
    setNodes(updateNodeInTree(nodes, id, changes));
  }, [nodes, setNodes]);

  const deleteNode = useCallback((id: string) => {
    setNodes(deleteNodeFromTree(nodes, id));
  }, [nodes, setNodes]);

  const moveNode = useCallback((index: number, direction: number) => {
    setNodes(moveNodeInList(nodes, index, direction));
  }, [nodes, setNodes]);

  const addChild = useCallback((parentId: string) => {
    setNodes(addChildToNode(nodes, parentId, createChildNode()));
  }, [nodes, setNodes]);

  return { updateNode, deleteNode, moveNode, addChild };
};
