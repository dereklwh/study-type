import { useState, useCallback } from 'react';
import { extractTextFromPDF } from '../../services/pdfService';
import { cleanText, generateId } from '../../utils/textProcessor';
import type { Document } from '../../types';

interface PDFUploadProps {
  onUpload: (doc: Document) => void;
}

export function PDFUpload({ onUpload }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const rawText = await extractTextFromPDF(file);
      const text = cleanText(rawText);

      if (text.length < 50) {
        setError('Could not extract enough text from the PDF');
        return;
      }

      const doc: Document = {
        id: generateId(),
        name: file.name.replace('.pdf', ''),
        text,
        createdAt: Date.now(),
      };

      onUpload(doc);
    } catch (err) {
      setError('Failed to process PDF. Please try another file.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center transition-colors
        ${isDragging ? 'border-accent bg-accent/10' : 'border-text-secondary/30'}
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      {isProcessing ? (
        <div className="text-text-secondary">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          Processing PDF...
        </div>
      ) : (
        <>
          <div className="text-4xl mb-4">📄</div>
          <p className="text-text-primary text-lg mb-2">
            Drop a PDF here or click to upload
          </p>
          <p className="text-text-secondary text-sm mb-4">
            Your study materials will be converted to typing tests
          </p>
          <label className="inline-block bg-accent text-bg-primary px-6 py-2 rounded cursor-pointer hover:opacity-90 transition-opacity">
            Choose File
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </>
      )}

      {error && (
        <p className="text-error mt-4">{error}</p>
      )}
    </div>
  );
}
