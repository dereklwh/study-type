import type { TestMode } from '../../types';

interface ModeSelectorProps {
  mode: TestMode;
  onChange: (mode: TestMode) => void;
}

const MODES: TestMode[] = [30, 60, 120];

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-2">
      {MODES.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`
            px-4 py-2 rounded font-mono transition-colors
            ${mode === m
              ? 'bg-accent text-bg-primary'
              : 'bg-bg-secondary text-text-secondary hover:text-text-primary'
            }
          `}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
