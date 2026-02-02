import type { TestResult } from '../../types';

interface ResultsProps {
  result: TestResult;
  onRestart: () => void;
}

export function Results({ result, onRestart }: ResultsProps) {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-accent mb-8">Test Complete!</h2>

      <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mb-8">
        <div className="bg-bg-secondary p-6 rounded-lg">
          <div className="text-text-secondary text-sm mb-1">wpm</div>
          <div className="text-5xl font-bold text-accent">{result.wpm}</div>
        </div>
        <div className="bg-bg-secondary p-6 rounded-lg">
          <div className="text-text-secondary text-sm mb-1">accuracy</div>
          <div className="text-5xl font-bold text-text-primary">{result.accuracy}%</div>
        </div>
        <div className="bg-bg-secondary p-6 rounded-lg">
          <div className="text-text-secondary text-sm mb-1">correct</div>
          <div className="text-3xl font-bold text-correct">{result.correctChars}</div>
        </div>
        <div className="bg-bg-secondary p-6 rounded-lg">
          <div className="text-text-secondary text-sm mb-1">errors</div>
          <div className="text-3xl font-bold text-error">{result.incorrectChars}</div>
        </div>
      </div>

      <div className="text-text-secondary mb-4">
        Document: {result.documentName} | Mode: {result.mode}s
      </div>

      <button
        onClick={onRestart}
        className="bg-accent text-bg-primary px-8 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}
