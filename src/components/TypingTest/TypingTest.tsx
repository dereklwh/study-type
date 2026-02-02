import { useState, useCallback, useEffect, useRef } from 'react';
import { useTypingTest } from '../../hooks/useTypingTest';
import { useTimer } from '../../hooks/useTimer';
import { WordDisplay } from './WordDisplay';
import { Stats } from './Stats';
import { Results } from './Results';
import type { Document, TestMode, TestResult, TypingState } from '../../types';
import { getRandomTextSegment, generateId } from '../../utils/textProcessor';

interface TypingTestProps {
  document: Document;
  mode: TestMode;
  onComplete: (result: TestResult) => void;
  useOptimizedText: boolean;
}

export function TypingTest({ document, mode, onComplete, useOptimizedText }: TypingTestProps) {
  const text = useOptimizedText && document.optimizedText
    ? document.optimizedText
    : document.text;

  const [testText, setTestText] = useState(() => getRandomTextSegment(text, 150));
  const [result, setResult] = useState<TestResult | null>(null);

  const statsRef = useRef<{ wpm: number; accuracy: number; state: TypingState } | null>(null);

  const handleTestComplete = useCallback(() => {
    if (!statsRef.current) return;
    const { wpm, accuracy, state } = statsRef.current;
    const testResult: TestResult = {
      id: generateId(),
      documentId: document.id,
      documentName: document.name,
      wpm,
      accuracy,
      mode,
      correctChars: state.correctChars,
      incorrectChars: state.incorrectChars,
      totalChars: state.correctChars + state.incorrectChars,
      completedAt: Date.now(),
    };
    setResult(testResult);
    onComplete(testResult);
  }, [document, mode, onComplete]);

  const { timeLeft, isRunning, start, reset: resetTimer } = useTimer(mode, handleTestComplete);

  const { state, reset: resetTyping, wpm, accuracy } = useTypingTest(
    testText,
    start,
    isRunning
  );

  statsRef.current = { wpm, accuracy, state };

  const handleRestart = useCallback(() => {
    const newText = getRandomTextSegment(text, 150);
    setTestText(newText);
    setResult(null);
    resetTimer(mode);
    resetTyping(newText);
  }, [text, mode, resetTimer, resetTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRestart]);

  if (result) {
    return <Results result={result} onRestart={handleRestart} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Stats
        wpm={wpm}
        accuracy={accuracy}
        timeLeft={timeLeft}
        isActive={state.isActive}
      />

      <div className="bg-bg-secondary p-8 rounded-lg mb-4">
        <WordDisplay state={state} />
      </div>

      {!state.isActive && (
        <p className="text-text-secondary text-center">
          Start typing to begin • Press Tab to restart
        </p>
      )}
    </div>
  );
}
