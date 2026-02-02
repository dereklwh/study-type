import { useState, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { PDFUpload } from './components/PDFUpload/PDFUpload';
import { ModeSelector } from './components/ModeSelector/ModeSelector';
import { TypingTest } from './components/TypingTest/TypingTest';
import { Settings } from './components/Settings/Settings';
import { useDocuments, useResults, useSettings } from './hooks/useStorage';
import { optimizeTextForLearning, isOpenAIInitialized, initializeOpenAI } from './services/aiService';
import type { Document, TestMode, TestResult } from './types';

function App() {
  const { documents, saveDocument, deleteDocument } = useDocuments();
  const { saveResult } = useResults();
  const { settings, updateSettings } = useSettings();

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [mode, setMode] = useState<TestMode>(60);
  const [showSettings, setShowSettings] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Initialize OpenAI if API key exists in settings
  if (settings?.openaiApiKey && !isOpenAIInitialized()) {
    initializeOpenAI(settings.openaiApiKey);
  }

  const handleUpload = useCallback(async (doc: Document) => {
    if (settings?.useAiOptimization && isOpenAIInitialized()) {
      setIsOptimizing(true);
      try {
        const optimizedText = await optimizeTextForLearning(doc.text);
        doc.optimizedText = optimizedText;
      } catch (err) {
        console.error('Failed to optimize text:', err);
      }
      setIsOptimizing(false);
    }
    await saveDocument(doc);
    setSelectedDoc(doc);
  }, [saveDocument, settings?.useAiOptimization]);

  const handleComplete = useCallback(async (result: TestResult) => {
    await saveResult(result);
  }, [saveResult]);

  const handleDeleteDoc = useCallback(async (id: string) => {
    await deleteDocument(id);
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  }, [deleteDocument, selectedDoc]);

  const customStyles = {
    '--color-bg-primary': settings?.bgPrimary ?? '#323437',
    '--color-accent': settings?.accent ?? '#5d8a66',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-8" style={customStyles}>
      <div className="max-w-5xl mx-auto">
        <Header onSettingsClick={() => setShowSettings(true)} />

        {!selectedDoc ? (
          <div className="space-y-8">
            <PDFUpload onUpload={handleUpload} />

            {isOptimizing && (
              <div className="text-center text-accent">
                <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2" />
                Optimizing text with AI...
              </div>
            )}

            {documents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-text-primary">Your Documents</h2>
                <div className="grid gap-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-bg-secondary p-4 rounded-lg flex justify-between items-center"
                    >
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="text-left flex-1 hover:text-accent transition-colors"
                      >
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-text-secondary text-sm">
                          {doc.text.split(' ').length} words
                          {doc.optimizedText && ' • AI optimized'}
                        </div>
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="text-text-secondary hover:text-error ml-4 p-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                ← Back to documents
              </button>
              <div className="flex items-center gap-4">
                <span className="text-text-secondary">Mode:</span>
                <ModeSelector mode={mode} onChange={setMode} />
              </div>
            </div>

            <TypingTest
              key={`${selectedDoc.id}-${mode}`}
              document={selectedDoc}
              mode={mode}
              onComplete={handleComplete}
              useOptimizedText={settings?.useAiOptimization ?? false}
            />
          </div>
        )}
      </div>

      {showSettings && settings && (
        <Settings
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
