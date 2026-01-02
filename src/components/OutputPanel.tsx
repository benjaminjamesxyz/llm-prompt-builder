import { memo } from 'preact/compat';
import { Button } from './Button';
import { Copy, Download } from './Icons';
import { FormatSelector } from './FormatSelector';
import { Format } from '../types';

interface OutputPanelProps {
  format: Format;
  onFormatChange: (format: Format) => void;
  highlightedCode: string;
  tokenCount: number;
  onCopy: () => void;
  copyFeedback: boolean;
  onDownload: () => void;
}

const OutputPanelInternal = ({
  format,
  onFormatChange,
  highlightedCode,
  tokenCount,
  onCopy,
  copyFeedback,
  onDownload
}: OutputPanelProps) => {
  return (
    <div className="flex-1 flex flex-col bg-bg min-w-[300px]">
      <div role="region" aria-label="Prompt output" className="p-3 border-b border-border bg-surface flex justify-between items-center">
        <FormatSelector selectedFormat={format} onFormatChange={onFormatChange} />

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
              onClick={onCopy}
              aria-label="Copy prompt to clipboard"
              title="Copy to Clipboard"
            >
              <Copy /> {copyFeedback ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="secondary"
              onClick={onDownload}
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
  );
};

export const OutputPanel = memo(OutputPanelInternal, (prevProps, nextProps) => {
  return (
    prevProps.format === nextProps.format &&
    prevProps.highlightedCode === nextProps.highlightedCode &&
    prevProps.tokenCount === nextProps.tokenCount &&
    prevProps.onCopy === nextProps.onCopy &&
    prevProps.copyFeedback === nextProps.copyFeedback &&
    prevProps.onDownload === nextProps.onDownload &&
    prevProps.onFormatChange === nextProps.onFormatChange
  );
});
