import { useCallback } from 'preact/hooks';
import { Node, Format } from '../types';
import { showToast } from '../components/Toast';
import { validateFileSize, safeJsonParse, validateNodes, ValidationError } from '../utils/validation';

const ERROR_MESSAGES_MAP: Record<ValidationError, string> = {
  [ValidationError.FILE_TOO_LARGE]: 'File exceeds 500KB limit (ERR_FILE_SIZE)',
  [ValidationError.INVALID_JSON]: 'Invalid JSON format (ERR_INVALID_JSON)',
  [ValidationError.INVALID_SCHEMA]: 'Invalid session file structure (ERR_INVALID_SCHEMA)',
  [ValidationError.INVALID_TAG]: 'Invalid tag format (ERR_INVALID_TAG)',
  [ValidationError.PARSE_ERROR]: 'Parse error occurred (ERR_PARSE)'
};

export const useFileOperations = (nodes: Node[], setNodes: (nodes: Node[]) => void) => {
  const downloadFile = useCallback((output: string, format: Format) => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const saveSession = useCallback(() => {
    const blob = new Blob([JSON.stringify(nodes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `prompt_session_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Session saved successfully', 'success');
  }, [nodes]);

  const loadSession = useCallback((file: File) => {
    const sizeCheck = validateFileSize(file);
    if (!sizeCheck.valid) {
      showToast(ERROR_MESSAGES_MAP[ValidationError.FILE_TOO_LARGE], 'error');
      return false;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result as string;

      const parseResult = safeJsonParse<unknown>(content);
      if (!parseResult.data) {
        showToast(ERROR_MESSAGES_MAP[ValidationError.INVALID_JSON], 'error');
        return;
      }

      const data = parseResult.data;
      if (!Array.isArray(data)) {
        showToast(ERROR_MESSAGES_MAP[ValidationError.INVALID_SCHEMA], 'error');
        return;
      }

      const validation = validateNodes(data);
      if (!validation.valid) {
        showToast(ERROR_MESSAGES_MAP[ValidationError.INVALID_SCHEMA], 'error');
        return;
      }

      setNodes(validation.nodes ?? []);
      showToast('Session loaded successfully', 'success');
    };

    reader.onerror = () => {
      showToast('Failed to read file (ERR_READ_FAILED)', 'error');
    };

    reader.readAsText(file);
    return true;
  }, [setNodes]);

  return { downloadFile, saveSession, loadSession };
};
