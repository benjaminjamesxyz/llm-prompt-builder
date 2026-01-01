import { Node } from '../types';
import { Button } from './Button';
import { Plus, ChevronUp, ChevronDown, Trash, List, Type } from './Icons';
import { SimpleItem } from './SimpleItem';
import { uuid } from '../utils/uuid';
import { sanitizeTagInput } from '../utils/validation';

interface BlockProps {
  node: Node;
  index: number;
  updateNode: (id: string, changes: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  moveNode: (index: number, direction: number) => void;
  addChild: (parentId: string) => void;
  depth?: number;
}

export const Block = ({ node, index, updateNode, deleteNode, moveNode, addChild, depth = 0 }: BlockProps) => {
  const handleContentChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    updateNode(node.id, { content: target.value });
  };

  const handleTagChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const sanitizedTag = sanitizeTagInput(target.value);
    updateNode(node.id, { tag: sanitizedTag });
  };

  const toggleListMode = () => {
    const newIsList = !node.isList;
    let updates: Partial<Node> = { isList: newIsList };
    if (newIsList) {
      const lines = node.content.split('\n').filter(l => l.trim() !== '');
      const newChildren = lines.map(line => ({ id: uuid(), tag: "ITEM", content: line }));
      updates.children = [...(node.children || []), ...newChildren];
      updates.content = "";
    } else {
      const listContent = (node.children || []).map(c => c.content).join('\n');
      updates.content = listContent;
      updates.children = [];
    }
    updateNode(node.id, updates);
  };

  const addListItem = () => {
    const newItem = { id: uuid(), tag: "ITEM", content: "" };
    updateNode(node.id, { children: [...(node.children || []), newItem] });
  };

  const moveItem = (childIndex: number, direction: number) => {
    const newChildren = [...(node.children || [])];
    if (childIndex + direction < 0 || childIndex + direction >= newChildren.length) return;
    const temp = newChildren[childIndex];
    newChildren[childIndex] = newChildren[childIndex + direction];
    newChildren[childIndex + direction] = temp;
    updateNode(node.id, { children: newChildren });
  };

  return (
    <div className="node-enter pl-2 border-l-2 border-surface2 my-2 group">
      <div className="flex flex-col gap-2 bg-surface p-3 rounded shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-textMuted select-none w-4 text-right">{depth + 1}.{index + 1}</span>
          <input 
            type="text" 
            value={node.tag} 
            onInput={handleTagChange} 
            placeholder="TAG_NAME"
            aria-label={`Block tag name: ${node.tag}`}
            id={`tag-${node.id}`}
            className="bg-bg border border-border rounded px-2 py-1 text-primary font-bold font-mono text-sm w-1/3 focus:outline-none focus:border-primary placeholder-surface2" 
          />
          <div className="ml-auto flex gap-1 items-center">
            <button 
              onClick={toggleListMode}
              aria-label={node.isList ? "Switch to text mode" : "Switch to list mode"}
              className="p-1.5 rounded hover:bg-surface2 text-textMuted hover:text-text transition-colors" 
              title={node.isList ? "Switch to Text Mode" : "Switch to List Mode"}
            >
              {node.isList ? <Type /> : <List />}
            </button>
            <div className="w-px h-4 bg-border mx-1"></div>
            <div className="flex gap-1">
              <Button variant="ghost" onClick={() => moveNode(index, -1)} aria-label="Move block up" title="Move Up"><ChevronUp /></Button>
              <Button variant="ghost" onClick={() => moveNode(index, 1)} aria-label="Move block down" title="Move Down"><ChevronDown /></Button>
              {!node.isList && <Button variant="ghost" onClick={() => addChild(node.id)} aria-label="Add nested block" title="Add Nested Block"><Plus /></Button>}
              <Button variant="danger" onClick={() => deleteNode(node.id)} aria-label="Delete block" title="Delete Block"><Trash /></Button>
            </div>
          </div>
        </div>
        {node.isList ? (
          <div className="mt-2 pl-4 border-l border-border/50">
            {node.children && node.children.map((child, i) => (
              <SimpleItem 
                key={child.id} 
                node={child} 
                index={i} 
                updateNode={updateNode} 
                deleteNode={deleteNode} 
                moveItem={moveItem} 
                isFirst={i === 0} 
                isLast={i === (node.children!.length - 1)} 
              />
            ))}
            <button 
              onClick={addListItem}
              aria-label="Add list item"
              className="text-xs flex items-center gap-1 text-primary hover:text-primaryHover mt-2"
            >
              <Plus /> Add Item
            </button>
          </div>
        ) : (
          <textarea 
            value={node.content} 
            onInput={handleContentChange}
            placeholder="Enter prompt content here..."
            aria-label={`Block content for ${node.tag}`}
            id={`content-${node.id}`}
            className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text editor-font focus:outline-none focus:border-primary resize-y min-h-[60px]"
          ></textarea>
        )}
      </div>
      {!node.isList && node.children && node.children.length > 0 && (
        <div className="ml-4">
          {node.children.map((child, i) => (
            <Block 
              key={child.id} 
              node={child} 
              index={i} 
              depth={depth + 1} 
              updateNode={updateNode} 
              deleteNode={deleteNode} 
              moveNode={moveNode} 
              addChild={addChild} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
