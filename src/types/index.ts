export interface Document {
  id: string;
  name: string;
  text: string;
  createdAt: number;
  optimizedText?: string;
}

export interface TestResult {
  id: string;
  documentId: string;
  documentName: string;
  wpm: number;
  accuracy: number;
  mode: TestMode;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  completedAt: number;
}

export type TestMode = 30 | 60 | 120;

export interface Settings {
  defaultMode: TestMode;
  openaiApiKey?: string;
  useAiOptimization: boolean;
  bgPrimary: string;
  accent: string;
}

export interface TypingState {
  words: string[];
  typedWords: string[];
  currentWordIndex: number;
  currentInput: string;
  correctChars: number;
  incorrectChars: number;
  isActive: boolean;
  isFinished: boolean;
  startTime: number | null;
}
