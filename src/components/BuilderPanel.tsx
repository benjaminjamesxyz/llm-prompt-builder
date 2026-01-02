import { Block } from './Block';
import { Plus } from './Icons';
import { Button } from './Button';
import { BlockPicker } from './BlockPicker';
import { Node, BlockDef } from '../types';

interface BuilderPanelProps {
  nodes: Node[];
  updateNode: (id: string, changes: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  moveNode: (index: number, direction: number) => void;
  addChild: (parentId: string) => void;
  isBlockMenuOpen: boolean;
  setIsBlockMenuOpen: (isOpen: boolean) => void;
  onAddBlock: (blockDef: BlockDef) => void;
  selectedModel: string;
}

export const BuilderPanel = ({
  nodes,
  updateNode,
  deleteNode,
  moveNode,
  addChild,
  isBlockMenuOpen,
  setIsBlockMenuOpen,
  onAddBlock,
  selectedModel
}: BuilderPanelProps) => {
  return (
    <div className="flex-1 flex flex-col border-r border-border min-w-[300px] relative">
      <div className="p-4 border-b border-border bg-bg sticky top-0 z-10 flex justify-between items-center">
        <h2 aria-label="Builder section" className="font-semibold text-textMuted uppercase text-xs tracking-wider">
          Builder
        </h2>
        <Button
          onClick={() => setIsBlockMenuOpen(!isBlockMenuOpen)}
          aria-label="Open block menu"
          aria-expanded={isBlockMenuOpen}
          className="relative"
        >
          <Plus /> Add Block
        </Button>
      </div>

      {isBlockMenuOpen && (
        <BlockPicker
          model={selectedModel}
          onSelect={onAddBlock}
          onClose={() => setIsBlockMenuOpen(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-textMuted opacity-50">
            <p>No blocks yet.</p>
            <p className="text-sm">Select a template or add a block.</p>
          </div>
        ) : (
          nodes.map((node, i) => (
            <Block
              key={node.id}
              node={node}
              index={i}
              updateNode={updateNode}
              deleteNode={deleteNode}
              moveNode={moveNode}
              addChild={addChild}
            />
          ))
        )}
      </div>
    </div>
  );
};
