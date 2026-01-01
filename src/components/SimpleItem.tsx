import { Node } from '../types';
import { ChevronUp, ChevronDown, Trash } from './Icons';

interface SimpleItemProps {
  node: Node;
  index: number;
  updateNode: (id: string, changes: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  moveItem: (index: number, direction: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SimpleItem = ({ node, index, updateNode, deleteNode, moveItem, isFirst, isLast }: SimpleItemProps) => {
  return (
    <div className="flex items-center gap-2 mb-2 node-enter group/item">
      <span className="text-xs font-mono text-textMuted select-none w-4 text-right">{index + 1}.</span>
      <input 
        type="text" 
        value={node.content} 
        onInput={(e) => updateNode(node.id, { content: (e.target as HTMLInputElement).value })}
        aria-label="List item content"
        className="flex-1 bg-bg border border-border rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary"
        placeholder="List item..."
      />
      <div className="flex gap-0.5">
        <button 
          onClick={() => moveItem(index, -1)}
          disabled={isFirst}
          aria-label="Move list item up"
          className="p-1 text-textMuted hover:text-text disabled:opacity-30 disabled:hover:text-textMuted"
          title="Move Up"
        >
          <ChevronUp />
        </button>
        <button 
          onClick={() => moveItem(index, 1)} 
          disabled={isLast}
          aria-label="Move list item down"
          className="p-1 text-textMuted hover:text-text disabled:opacity-30 disabled:hover:text-textMuted"
          title="Move Down"
        >
          <ChevronDown />
        </button>
      </div>
      <button 
        onClick={() => deleteNode(node.id)}
        aria-label="Delete list item"
        className="p-1.5 text-textMuted hover:text-red-400 transition-colors"
        title="Delete Item"
      >
        <Trash />
      </button>
    </div>
  );
};
