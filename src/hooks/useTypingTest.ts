import { useState, useCallback, useEffect } from 'react';
import type { TypingState } from '../types';
import { splitIntoWords } from '../utils/textProcessor';

interface UseTypingTestReturn {
  state: TypingState;
  handleKeyDown: (e: KeyboardEvent) => void;
  reset: (newText?: string) => void;
  wpm: number;
  accuracy: number;
}

export function useTypingTest(
  initialText: string,
  onStart: () => void,
  isTimerRunning: boolean
): UseTypingTestReturn {
  const [state, setState] = useState<TypingState>(() => ({
    words: splitIntoWords(initialText),
    typedWords: [],
    currentWordIndex: 0,
    currentInput: '',
    correctChars: 0,
    incorrectChars: 0,
    isActive: false,
    isFinished: false,
    startTime: null,
  }));

  const reset = useCallback((newText?: string) => {
    setState({
      words: splitIntoWords(newText ?? initialText),
      typedWords: [],
      currentWordIndex: 0,
      currentInput: '',
      correctChars: 0,
      incorrectChars: 0,
      isActive: false,
      isFinished: false,
      startTime: null,
    });
  }, [initialText]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state.isFinished) return;

    if (!state.isActive && !isTimerRunning) {
      setState(prev => ({ ...prev, isActive: true, startTime: Date.now() }));
      onStart();
    }

    const currentWord = state.words[state.currentWordIndex];
    if (!currentWord) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      setState(prev => {
        // If there's input, just delete the last character
        if (prev.currentInput.length > 0) {
          return {
            ...prev,
            currentInput: prev.currentInput.slice(0, -1),
          };
        }

        // If no input and we're not at the first word, go back to previous word
        if (prev.currentWordIndex > 0) {
          const prevWordIndex = prev.currentWordIndex - 1;
          const prevTypedWord = prev.typedWords[prevWordIndex] ?? '';
          const prevExpectedWord = prev.words[prevWordIndex];

          // Recalculate the stats that were added for the previous word
          const wasCorrect = prevTypedWord === prevExpectedWord;
          const correctCharsInPrevWord = prevTypedWord.split('').filter((char, i) => char === prevExpectedWord[i]).length;
          const incorrectCharsInPrevWord = prevTypedWord.length - correctCharsInPrevWord;

          return {
            ...prev,
            currentWordIndex: prevWordIndex,
            currentInput: prevTypedWord,
            typedWords: prev.typedWords.slice(0, -1),
            correctChars: prev.correctChars - correctCharsInPrevWord - (wasCorrect ? 1 : 0),
            incorrectChars: prev.incorrectChars - incorrectCharsInPrevWord - (wasCorrect ? 0 : 1),
          };
        }

        return prev;
      });
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (state.currentInput.length === 0) return;

      const isCorrect = state.currentInput === currentWord;
      const correctCharsInWord = state.currentInput.split('').filter((char, i) => char === currentWord[i]).length;
      const incorrectCharsInWord = state.currentInput.length - correctCharsInWord;

      setState(prev => {
        const nextIndex = prev.currentWordIndex + 1;
        const isLastWord = nextIndex >= prev.words.length;
        const newTypedWords = [...prev.typedWords, prev.currentInput];

        return {
          ...prev,
          typedWords: newTypedWords,
          currentWordIndex: isLastWord ? prev.currentWordIndex : nextIndex,
          currentInput: '',
          correctChars: prev.correctChars + correctCharsInWord + (isCorrect ? 1 : 0),
          incorrectChars: prev.incorrectChars + incorrectCharsInWord + (isCorrect ? 0 : 1),
          isFinished: isLastWord,
        };
      });
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      setState(prev => ({
        ...prev,
        currentInput: prev.currentInput + e.key,
      }));
    }
  }, [state, onStart, isTimerRunning]);

  useEffect(() => {
    if (!state.isFinished) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.isFinished, handleKeyDown]);

  const elapsed = state.startTime
    ? (Date.now() - state.startTime) / 1000 / 60
    : 0;

  const wpm = elapsed > 0
    ? Math.round((state.correctChars / 5) / elapsed)
    : 0;

  const totalChars = state.correctChars + state.incorrectChars;
  const accuracy = totalChars > 0
    ? Math.round((state.correctChars / totalChars) * 100)
    : 100;

  return { state, handleKeyDown, reset, wpm, accuracy };
}
