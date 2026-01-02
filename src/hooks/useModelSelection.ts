import { useState, useMemo, useCallback } from 'preact/hooks';
import { Node, ModelKey, Example } from '../types';
import { MODEL_EXAMPLES } from '../data';
import { regenerateNodeIds } from '../utils/nodeOperations';

interface ModelSelectionReturn {
  selectedModel: string;
  availableExamples: Example[];
  handleModelChange: (newModel: string) => void;
  loadExample: (index: string) => void;
}

export const useModelSelection = (setNodes: (nodes: Node[]) => void): ModelSelectionReturn => {
  const [selectedModel, setSelectedModel] = useState<string>('generic');

  const availableExamples = useMemo(() => {
    const genericTemplates = MODEL_EXAMPLES['generic'];
    if (selectedModel === 'generic') {
      return genericTemplates;
    }

    const specificExamples = MODEL_EXAMPLES[selectedModel as ModelKey] ?? [];

    if (selectedModel === 'image' || selectedModel === 'video') {
      const emptyTemplate = genericTemplates.filter((t: Example) => t.name === 'Empty');
      return [...specificExamples, ...emptyTemplate];
    }

    return [...specificExamples, ...genericTemplates];
  }, [selectedModel]);

  const loadExampleData = useCallback((exampleNodes: Node[]) => {
    const newNodes = JSON.parse(JSON.stringify(exampleNodes)) as Node[];
    setNodes(regenerateNodeIds(newNodes));
  }, [setNodes]);

  const loadExample = useCallback((index: string) => {
    const example = availableExamples[Number(index)];
    if (example) {
      loadExampleData(example.nodes);
    }
  }, [availableExamples, loadExampleData]);

  const handleModelChange = useCallback((newModel: string) => {
    setSelectedModel(newModel);

    const genericTemplates = MODEL_EXAMPLES['generic'];
    const specificExamples = MODEL_EXAMPLES[newModel as ModelKey] ?? [];
    let defaultExample: Example | undefined;

    if (newModel === 'generic') {
      defaultExample = genericTemplates[0];
    } else if (newModel === 'image' || newModel === 'video') {
      defaultExample = specificExamples.length > 0
        ? specificExamples[0]
        : genericTemplates.find((t: Example) => t.name === 'Empty');
    } else {
      defaultExample = specificExamples.length > 0
        ? specificExamples[0]
        : genericTemplates[0];
    }

    if (defaultExample) {
      loadExampleData(defaultExample.nodes);
    }
  }, [loadExampleData]);

  return {
    selectedModel,
    availableExamples,
    handleModelChange,
    loadExample
  };
};
