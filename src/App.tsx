import { useState, useEffect, useMemo } from 'preact/hooks';
import { Node, Format, BlockDef } from './types/index';
import { Button } from './components/Button';
import { Block } from './components/Block';
import { BlockPicker } from './components/BlockPicker';
import { Code, Plus, Copy, Download, Upload } from './components/Icons';
import { MODEL_EXAMPLES, MODELS } from './data/index';
import { toXML, toObjectTree, toTOON, toMarkdown } from './utils/formatters';
import { saveToLocalStorage } from './utils/storage';
import { highlightCode } from './utils/prism';
import { uuid } from './utils/uuid';
import { loadNodesFromLocalStorage } from './utils/storage';
import { validateFileSize, safeJsonParse, validateNodes, ValidationError } from './utils/validation';
import { showToast } from './components/Toast';
import 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import yaml from 'js-yaml';

const ERROR_MESSAGES = {
  [ValidationError.FILE_TOO_LARGE]: 'File exceeds 500KB limit (ERR_FILE_SIZE)',
  [ValidationError.INVALID_JSON]: 'Invalid JSON format (ERR_INVALID_JSON)',
  [ValidationError.INVALID_SCHEMA]: 'Invalid session file structure (ERR_INVALID_SCHEMA)',
};

export const App = () => {
  const [nodes, setNodes] = useState<Node[]>(() => {
    return loadNodesFromLocalStorage() || MODEL_EXAMPLES['generic'][0].nodes;
  });
  const [format, setFormat] = useState<Format>('xml');
  const [theme, setTheme] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [selectedModel, setSelectedModel] = useState('generic');
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState(false);

  useEffect(() => {
    saveToLocalStorage('prompt_builder_autosave', nodes);
  }, [nodes]);

  const availableExamples = useMemo(() => {
    const genericTemplates = MODEL_EXAMPLES['generic'];
    if (selectedModel === 'generic') return genericTemplates;
    const specificExamples = MODEL_EXAMPLES[selectedModel as keyof typeof MODEL_EXAMPLES] || [];
    if (['image', 'video'].includes(selectedModel)) {
      const emptyTemplate = genericTemplates.filter((t: { name: string }) => t.name === "Empty");
      return [...specificExamples, ...emptyTemplate];
    }
    return [...specificExamples, ...genericTemplates];
  }, [selectedModel]);

  const loadExampleData = (exampleNodes: Node[]) => {
    const newNodes = JSON.parse(JSON.stringify(exampleNodes));
    const reId = (list: Node[]): Node[] => list.map(n => ({
      ...n,
      id: uuid(),
      children: n.children ? reId(n.children) : []
    }));
    setNodes(reId(newNodes));
  };

  const loadExample = (index: string) => {
    const example = availableExamples[parseInt(index)];
    if (example) loadExampleData(example.nodes);
  };

  const handleModelChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const newModel = target.value;
    setSelectedModel(newModel);
    const genericTemplates = MODEL_EXAMPLES['generic'];
    const specificExamples = MODEL_EXAMPLES[newModel as keyof typeof MODEL_EXAMPLES] || [];
    let defaultExample;
    if (newModel === 'generic') {
      defaultExample = genericTemplates[0];
    } else if (['image', 'video'].includes(newModel)) {
      defaultExample = specificExamples.length > 0 ? specificExamples[0] : genericTemplates.find((t: { name: string }) => t.name === "Empty");
    } else {
      defaultExample = specificExamples.length > 0 ? specificExamples[0] : genericTemplates[0];
    }
    if (defaultExample) loadExampleData(defaultExample.nodes);
  };

  const handleFormatChange = (newFormat: Format) => {
    setFormat(newFormat);
  };

  const updateNode = (id: string, changes: Partial<Node>) => {
    const recUpdate = (list: Node[]): Node[] => list.map(n => {
      if (n.id === id) return { ...n, ...changes };
      if (n.children) return { ...n, children: recUpdate(n.children) };
      return n;
    });
    setNodes(recUpdate(nodes));
  };

  const deleteNode = (id: string) => {
    const recDelete = (list: Node[]): Node[] => list.filter(n => n.id !== id).map(n => ({
      ...n,
      children: n.children ? recDelete(n.children) : []
    }));
    setNodes(recDelete(nodes));
  };

  const moveNode = (index: number, direction: number) => {
    const newNodes = [...nodes];
    if (index + direction < 0 || index + direction >= newNodes.length) return;
    const temp = newNodes[index];
    newNodes[index] = newNodes[index + direction];
    newNodes[index + direction] = temp;
    setNodes(newNodes);
  };

  const addBlockFromType = (blockDef: BlockDef) => {
    setNodes([...nodes, { id: uuid(), tag: blockDef.tag, content: blockDef.content || "", children: [] }]);
    setIsBlockMenuOpen(false);
  };

  const addChild = (parentId: string) => {
    const recAdd = (list: Node[]): Node[] => list.map(n => {
      if (n.id === parentId) {
        return { ...n, children: [...(n.children || []), { id: uuid(), tag: "SUB_BLOCK", content: "", children: [] }] };
      }
      if (n.children) return { ...n, children: recAdd(n.children) };
      return n;
    });
    setNodes(recAdd(nodes));
  };

const output = useMemo(() => {
    try {
      switch (format) {
        case 'xml': return toXML(nodes);
        case 'json': return JSON.stringify(toObjectTree(nodes), null, 2);
        case 'yaml': return yaml.dump(toObjectTree(nodes));
        case 'toon': return toTOON(nodes);
        case 'md': return toMarkdown(nodes);
        default: return '';
      }
    } catch (e) {
      return `Error generating ${format.toUpperCase()}:\n${(e as Error).message}`;
    }
  }, [nodes, format]);

 const highlightedCode = useMemo(() => {
    return highlightCode(output, format);
  }, [output, format]);

  const tokenCount = useMemo(() => Math.ceil(output.length / 4), [output]);

  const copyToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = output;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
      showToast('Failed to copy to clipboard. Try again.', 'error');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt.${format}`;
    a.click();
  };

  const saveSession = () => {
    const blob = new Blob([JSON.stringify(nodes)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_session_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const loadSession = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    
    const sizeCheck = validateFileSize(file);
    if (!sizeCheck.valid) {
      showToast(ERROR_MESSAGES[ValidationError.FILE_TOO_LARGE], 'error');
      target.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;
      
      const parseResult = safeJsonParse(content);
      if (!parseResult.data) {
        showToast(ERROR_MESSAGES[ValidationError.INVALID_JSON], 'error');
        return;
      }
      
      const data = parseResult.data;
      if (!Array.isArray(data)) {
        showToast(ERROR_MESSAGES[ValidationError.INVALID_SCHEMA], 'error');
        return;
      }
      
      const validation = validateNodes(data);
      if (!validation.valid) {
        showToast(ERROR_MESSAGES[ValidationError.INVALID_SCHEMA], 'error');
        return;
      }
      
      setNodes(validation.nodes!);
      showToast('Session loaded successfully', 'success');
      target.value = '';
    };
    
    reader.onerror = () => {
      showToast('Failed to read file (ERR_READ_FAILED)', 'error');
    };
    
    reader.readAsText(file);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header role="banner" className="h-14 border-b border-border bg-surface flex items-center px-4 justify-between shrink-0 gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 mr-auto shrink-0">
          <Code className="text-primary" />
          <h1 className="font-bold text-lg tracking-tight hidden md:block">
            <span className="text-primary">LLM Prompt</span> Builder
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="model-select" className="text-xs text-textMuted font-bold uppercase hidden sm:block">Model:</label>
          <select 
            id="model-select"
            value={selectedModel} 
            onChange={handleModelChange}
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
            onChange={(e) => loadExample((e.target as HTMLSelectElement).value)}
            aria-label={`Select ${selectedModel === 'generic' ? 'template' : 'example'}`}
            className="bg-bg border border-border text-xs rounded px-2 py-1 focus:outline-none w-32 md:w-40"
          >
            <option value="" disabled selected>Select...</option>
            {availableExamples.map((ex: { name: string }, idx: number) => (
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
            onChange={loadSession}
          />
          <Button 
            variant="secondary" 
            onClick={saveSession}
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
          onChange={(e) => setTheme((e.target as HTMLSelectElement).value)}
          aria-label="Select color theme"
          className="bg-bg border border-border text-xs rounded px-2 py-1 focus:outline-none w-auto min-w-[100px] shrink-0"
        >
          <option value="">Catppuccin</option>
          <option value="theme-dracula">Dracula</option>
          <option value="theme-gruvbox">Gruvbox</option>
          <option value="theme-tokyo">Tokyo Night</option>
        </select>
      </header>
      <main role="main" className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col border-r border-border min-w-[300px] relative">
          <div className="p-4 border-b border-border bg-bg sticky top-0 z-10 flex justify-between items-center">
            <h2 aria-label="Builder section" className="font-semibold text-textMuted uppercase text-xs tracking-wider">Builder</h2>
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
              onSelect={addBlockFromType} 
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
        <div className="flex-1 flex flex-col bg-bg min-w-[300px]">
          <div role="region" aria-label="Prompt output" className="p-3 border-b border-border bg-surface flex justify-between items-center">
<div className="flex gap-2">
                {(Object.keys({ xml: null, json: null, yaml: null, toon: null, md: null }) as Format[]).map(fmt => (
                  <button 
                    key={fmt}
                    aria-label={`Switch to ${fmt.toUpperCase()} format`}
                    aria-pressed={format === fmt}
                    className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                      format === fmt 
                        ? 'bg-primary text-bg' 
                        : 'text-textMuted hover:text-text bg-bg border border-border'
                    }`} 
                    onClick={() => handleFormatChange(fmt)}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            <div className="flex items-center gap-4">
              <span 
                className="text-xs font-mono text-textMuted" 
                title="Rough estimate (chars / 4)"
              >
                ~{tokenCount} tokens
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={copyToClipboard}
                  aria-label="Copy prompt to clipboard"
                  title="Copy to Clipboard"
                >
                  <Copy /> {copyFeedback ? 'Copied!' : 'Copy'}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={downloadFile}
                  aria-label="Download prompt file"
                  title="Download File"
                >
                  <Download />
                </Button>
              </div>
            </div>
          </div>
<div className="flex-1 overflow-auto bg-bg p-4">
              <pre className="m-0 h-full font-mono text-sm leading-relaxed">
                <code dangerouslySetInnerHTML={{ __html: highlightedCode }}></code>
              </pre>
            </div>
        </div>
      </main>
    </div>
  );
};
