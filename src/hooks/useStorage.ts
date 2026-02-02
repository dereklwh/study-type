import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import type { Document, TestResult, Settings } from '../types';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const docs = await storageService.documents.getAll();
    setDocuments(docs);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveDocument = useCallback(async (doc: Document) => {
    await storageService.documents.save(doc);
    await refresh();
  }, [refresh]);

  const deleteDocument = useCallback(async (id: string) => {
    await storageService.documents.delete(id);
    await refresh();
  }, [refresh]);

  return { documents, loading, saveDocument, deleteDocument, refresh };
}

export function useResults() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const history = await storageService.results.getHistory();
    setResults(history);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveResult = useCallback(async (result: TestResult) => {
    await storageService.results.save(result);
    await refresh();
  }, [refresh]);

  return { results, loading, saveResult, refresh };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const s = await storageService.settings.get();
    setSettings(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    await storageService.settings.update(updates);
    await refresh();
  }, [refresh]);

  return { settings, loading, updateSettings, refresh };
}
