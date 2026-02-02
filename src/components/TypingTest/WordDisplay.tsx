import type { TypingState } from '../../types';

interface WordDisplayProps {
  state: TypingState;
}

export function WordDisplay({ state }: WordDisplayProps) {
  const { words, typedWords, currentWordIndex, currentInput } = state;

  const Cursor = () => (
    <span
      className="inline-block w-[2px] h-[1.2em] bg-accent align-middle"
      style={{ animation: 'blink 1s step-end infinite', margin: 0, padding: 0 }}
    />
  );

  return (
    <div className="font-mono text-2xl leading-relaxed select-none">
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      {words.map((word, wordIndex) => {
        const isCurrentWord = wordIndex === currentWordIndex;
        const isPastWord = wordIndex < currentWordIndex;
        const isFutureWord = wordIndex > currentWordIndex;
        const typedWord = isPastWord ? typedWords[wordIndex] : currentInput;

        return (
          <span key={wordIndex}>
            {word.split('').map((char, charIndex) => {
              let className = '';

              if (isPastWord) {
                const typedChar = typedWord?.[charIndex];
                if (typedChar === undefined) {
                  className = 'text-error underline';
                } else if (typedChar === char) {
                  className = 'text-correct';
                } else {
                  className = 'text-error';
                }
              } else if (isCurrentWord) {
                const typedChar = currentInput[charIndex];
                if (typedChar === undefined) {
                  className = 'text-text-secondary';
                } else if (typedChar === char) {
                  className = 'text-correct';
                } else {
                  className = 'text-error';
                }
              } else if (isFutureWord) {
                className = 'text-text-secondary';
              }

              const showCursorBefore = isCurrentWord && charIndex === currentInput.length;

              return (
                <span key={charIndex}>
                  {showCursorBefore && <Cursor />}
                  <span className={className}>{char}</span>
                </span>
              );
            })}
            {isPastWord && typedWord && typedWord.length > word.length && (
              <span className="text-error line-through">
                {typedWord.slice(word.length)}
              </span>
            )}
            {isCurrentWord && currentInput.length === word.length && (
              <Cursor />
            )}
            {isCurrentWord && currentInput.length > word.length && (
              <>
                <span className="text-error">
                  {currentInput.slice(word.length)}
                </span>
                <Cursor />
              </>
            )}
            <span> </span>
          </span>
        );
      })}
    </div>
  );
}
