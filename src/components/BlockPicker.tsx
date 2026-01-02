import { useRef, useEffect } from 'preact/hooks';
import { BlockDef } from '../types';
import { MODELS, BLOCK_DEFS } from '../data';
import { X } from './Icons';

interface BlockPickerProps {
  model: string;
  onSelect: (blockDef: BlockDef) => void;
  onClose: () => void;
}

export const BlockPicker = ({ model, onSelect, onClose }: BlockPickerProps) => {
  const modelConfig = MODELS[model as keyof typeof MODELS] ?? MODELS['generic'];
  const availableBlocks: Array<BlockDef & { tag: string; desc: string }> = modelConfig.blocks
    .map((key: string) => ({ key, ...BLOCK_DEFS[key] }))
    .filter((b): b is BlockDef & { tag: string; desc: string } & { key: string } =>
      'tag' in b && 'desc' in b
    );
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={menuRef} className="absolute top-12 right-4 z-50 w-64 bg-surface border border-border rounded shadow-xl modal-enter overflow-hidden">
      <div className="bg-surface2 px-3 py-2 flex justify-between items-center border-b border-border">
        <span className="text-xs font-bold uppercase text-textMuted tracking-wider">
          Add Block ({modelConfig.name})
        </span>
        <button onClick={onClose} className="text-textMuted hover:text-text">
          <X />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto p-2 grid gap-1">
        {availableBlocks.map((block) => (
          <button
            key={block.tag}
            onClick={() => onSelect(block)}
            className="text-left px-3 py-2 rounded hover:bg-surface2 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-primary text-xs font-mono">{block.tag}</span>
            </div>
            <div className="text-xs text-textMuted mt-0.5 truncate group-hover:text-text">{block.desc}</div>
          </button>
        ))}
        <button
          onClick={() => onSelect({ tag: "NEW_BLOCK", content: "", desc: "" })}
          className="text-left px-3 py-2 rounded hover:bg-surface2 transition-colors border-t border-border mt-1"
        >
          <span className="font-bold text-text text-xs">Empty Block</span>
        </button>
      </div>
    </div>
  );
};
