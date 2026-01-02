import { Code, Upload, Download } from './Icons';
import { Button } from './Button';
import { MODELS } from '../data';

interface HeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableExamples: { name: string }[];
  onExampleLoad: (index: string) => void;
  onLoadSession: (e: Event) => void;
  onSaveSession: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

export const Header = ({
  selectedModel,
  onModelChange,
  availableExamples,
  onExampleLoad,
  onLoadSession,
  onSaveSession,
  theme,
  onThemeChange
}: HeaderProps) => {
  return (
    <header role="banner" className="h-14 border-b border-border bg-surface flex items-center px-4 justify-between shrink-0 gap-4 overflow-x-auto">
      <div className="flex items-center gap-2 mr-auto shrink-0">
        <Code className="text-primary" />
        <h1 className="font-bold text-lg tracking-tight hidden md:block">
          <span className="text-primary">LLM Prompt</span> Builder
        </h1>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <label htmlFor="model-select" className="text-xs text-textMuted font-bold uppercase hidden sm:block">
          Model:
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => onModelChange((e.target as HTMLSelectElement).value)}
          aria-label="Select AI model"
          className="bg-bg border border-border text-xs rounded px-2 py-1 focus:outline-none w-32 md:w-40"
        >
          {Object.entries(MODELS).map(([key, val]) => (
            <option key={key} value={key}>{(val as { name: string }).name}</option>
          ))}
        </select>
      </div>

      <div className="h-4 w-px bg-border hidden sm:block shrink-0"></div>

      <div className="flex items-center gap-2 shrink-0">
        <label htmlFor="template-select" className="text-xs text-textMuted font-bold uppercase hidden sm:block">
          {selectedModel === 'generic' ? 'Template:' : 'Example:'}
        </label>
        <select
          id="template-select"
          key={selectedModel}
          onChange={(e) => onExampleLoad((e.target as HTMLSelectElement).value)}
          aria-label={`Select ${selectedModel === 'generic' ? 'template' : 'example'}`}
          className="bg-bg border border-border text-xs rounded px-2 py-1 focus:outline-none w-32 md:w-40"
        >
          <option value="" disabled selected>Select...</option>
          {availableExamples.map((ex, idx) => (
            <option key={idx} value={idx}>{ex.name}</option>
          ))}
        </select>
      </div>

      <div className="h-4 w-px bg-border hidden sm:block shrink-0"></div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          onClick={() => document.getElementById('loadInput')?.click()}
          aria-label="Load session file"
          title="Load Session"
          className="hidden sm:flex"
        >
          <Upload />
        </Button>
        <input
          type="file"
          id="loadInput"
          className="hidden"
          accept=".json"
          aria-label="Load session file"
          onChange={onLoadSession}
        />
        <Button
          variant="secondary"
          onClick={onSaveSession}
          aria-label="Save session file"
          title="Save Session"
          className="hidden sm:flex"
        >
          <Download />
        </Button>
      </div>

      <select
        id="theme-select"
        value={theme}
        onChange={(e) => onThemeChange((e.target as HTMLSelectElement).value)}
        aria-label="Select color theme"
        className="bg-bg border border-border text-xs rounded px-2 py-1 focus:outline-none w-auto min-w-[100px] shrink-0"
      >
        <option value="">Catppuccin</option>
        <option value="theme-dracula">Dracula</option>
        <option value="theme-gruvbox">Gruvbox</option>
        <option value="theme-tokyo">Tokyo Night</option>
      </select>
    </header>
  );
};
