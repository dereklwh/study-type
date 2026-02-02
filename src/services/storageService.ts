import type { Document, TestResult, Settings } from '../types';

const STORAGE_KEYS = {
  DOCUMENTS: 'study-game-documents',
  RESULTS: 'study-game-results',
  SETTINGS: 'study-game-settings',
} as const;

const DEFAULT_SETTINGS: Settings = {
  defaultMode: 60,
  useAiOptimization: false,
  bgPrimary: '#323437',
  accent: '#5d8a66',
};

export const storageService = {
  documents: {
    async save(doc: Document): Promise<void> {
      const docs = await this.getAll();
      const existingIndex = docs.findIndex(d => d.id === doc.id);
      if (existingIndex >= 0) {
        docs[existingIndex] = doc;
      } else {
        docs.push(doc);
      }
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    },

    async getAll(): Promise<Document[]> {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : [];
    },

    async delete(id: string): Promise<void> {
      const docs = await this.getAll();
      const filtered = docs.filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
    },
  },

  results: {
    async save(result: TestResult): Promise<void> {
      const results = await this.getHistory();
      results.push(result);
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
    },

    async getHistory(): Promise<TestResult[]> {
      const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
      return data ? JSON.parse(data) : [];
    },
  },

  settings: {
    async get(): Promise<Settings> {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    },

    async update(settings: Partial<Settings>): Promise<void> {
      const current = await this.get();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    },
  },
};
