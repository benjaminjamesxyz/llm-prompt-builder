import { useState, useMemo, useCallback, useEffect } from 'preact/hooks';
import { Node, Format } from './types';
import { Header } from './components/Header';
import { BuilderPanel } from './components/BuilderPanel';
import { OutputPanel } from './components/OutputPanel';
import { showToast } from './components/Toast';
import { MODEL_EXAMPLES } from './data';
import { toXML, toObjectTree, toTOON, toMarkdown } from './utils/formatters';
import { highlightCode } from './utils/prism';
import { loadNodesFromLocalStorage } from './utils/storage';
import { createEmptyNode } from './utils/nodeOperations';
import { useNodeOperations } from './hooks/useNodeOperations';
import { useFileOperations } from './hooks/useFileOperations';
import { useSessionStorage } from './hooks/useSessionStorage';
import { useModelSelection } from './hooks/useModelSelection';
import { DEFAULT_FORMAT, DEFAULT_THEME, COPY_FEEDBACK_DURATION } from './constants';
import 'prismjs';

export const App = () => {
  const [nodes, setNodes] = useState<Node[]>(() => {
    return loadNodesFromLocalStorage() || MODEL_EXAMPLES['generic'][0].nodes;
  });
  const [format, setFormat] = useState<Format>(DEFAULT_FORMAT);
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [isBlockMenuOpen, setIsBlockMenuOpen] = useState<boolean>(false);
  const [yamlModule, setYamlModule] = useState<any>(null);

  useSessionStorage(nodes);

  const nodeOps = useNodeOperations(nodes, setNodes);
  const fileOps = useFileOperations(nodes, setNodes);
  const modelSelection = useModelSelection(setNodes);

  useEffect(() => {
    if (format === 'yaml' && !yamlModule) {
      import('js-yaml').then(mod => setYamlModule(mod));
    }

    const Prism = (window as any).Prism;
    if (Prism) {
      if (format === 'md' && !Prism.languages.markdown) {
        // @ts-expect-error - Prism language components don't have type definitions
        import('prismjs/components/prism-markdown');
      }
      if (format === 'yaml' && !Prism.languages.yaml) {
        // @ts-expect-error - Prism language components don't have type definitions
        import('prismjs/components/prism-yaml');
      }
    }
  }, [format, yamlModule]);

  const output = useMemo(() => {
    try {
      switch (format) {
        case 'xml':
          return toXML(nodes);
        case 'json':
          return JSON.stringify(toObjectTree(nodes), null, 2);
        case 'yaml':
          return yamlModule ? yamlModule.dump(toObjectTree(nodes)) : 'Loading YAML formatter...';
        case 'toon':
          return toTOON(nodes);
        case 'md':
          return toMarkdown(nodes);
        default:
          return '';
      }
    } catch (e) {
      return `Error generating ${format.toUpperCase()}:\n${(e as Error).message}`;
    }
  }, [nodes, format, yamlModule]);

  const highlightedCode = useMemo(() => {
    return highlightCode(output, format);
  }, [output, format]);

  const tokenCount = useMemo(() => Math.ceil(output.length / 4), [output]);

  const copyToClipboard = useCallback(() => {
    const textarea = document.createElement('textarea');
    textarea.value = output;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), COPY_FEEDBACK_DURATION);
    } catch (err) {
      console.error('Copy failed', err);
      showToast('Failed to copy to clipboard. Try again.', 'error');
    } finally {
      document.body.removeChild(textarea);
    }
  }, [output]);

  const downloadPromptFile = useCallback(() => {
    fileOps.downloadFile(output, format);
  }, [fileOps, output, format]);

  const addBlockFromType = useCallback((blockDef: { tag: string; content: string; desc: string }) => {
    const newNode = createEmptyNode(blockDef.tag, blockDef.content ?? '');
    setNodes([...nodes, newNode]);
    setIsBlockMenuOpen(false);
  }, [nodes, setNodes]);

  const loadSession = useCallback((e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      fileOps.loadSession(file);
      target.value = '';
    }
  }, [fileOps]);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        selectedModel={modelSelection.selectedModel}
        onModelChange={modelSelection.handleModelChange}
        availableExamples={modelSelection.availableExamples}
        onExampleLoad={modelSelection.loadExample}
        onLoadSession={loadSession}
        onSaveSession={fileOps.saveSession}
        theme={theme}
        onThemeChange={setTheme}
      />
      <main role="main" className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <BuilderPanel
          nodes={nodes}
          updateNode={nodeOps.updateNode}
          deleteNode={nodeOps.deleteNode}
          moveNode={nodeOps.moveNode}
          addChild={nodeOps.addChild}
          isBlockMenuOpen={isBlockMenuOpen}
          setIsBlockMenuOpen={setIsBlockMenuOpen}
          onAddBlock={addBlockFromType}
          selectedModel={modelSelection.selectedModel}
        />
        <OutputPanel
          format={format}
          onFormatChange={setFormat}
          highlightedCode={highlightedCode}
          tokenCount={tokenCount}
          onCopy={copyToClipboard}
          copyFeedback={copyFeedback}
          onDownload={downloadPromptFile}
        />
      </main>
    </div>
  );
};
