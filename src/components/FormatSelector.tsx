import { Format } from '../types';

interface FormatSelectorProps {
  selectedFormat: Format;
  onFormatChange: (format: Format) => void;
}

const FORMATS: Format[] = ['xml', 'json', 'yaml', 'toon', 'md'];

export const FormatSelector = ({ selectedFormat, onFormatChange }: FormatSelectorProps) => {
  return (
    <div className="flex gap-2">
      {FORMATS.map((fmt) => (
        <button
          key={fmt}
          aria-label={`Switch to ${fmt.toUpperCase()} format`}
          aria-pressed={selectedFormat === fmt}
          className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
            selectedFormat === fmt
              ? 'bg-primary text-bg'
              : 'text-textMuted hover:text-text bg-bg border border-border'
          }`}
          onClick={() => onFormatChange(fmt)}
        >
          {fmt}
        </button>
      ))}
    </div>
  );
};
