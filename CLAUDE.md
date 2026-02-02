# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This is a typing test app for studying PDF documents. Users upload PDFs, text is extracted, and they practice typing the content with timed tests (30/60/120 seconds).

### Core Data Flow

1. **PDF Upload** → `pdfService.ts` extracts text using pdf.js (worker in `public/pdf.worker.mjs`)
2. **Optional AI Optimization** → `aiService.ts` uses OpenAI to condense text for learning (requires API key in settings)
3. **Storage** → `storageService.ts` persists documents, results, and settings to localStorage
4. **Typing Test** → `useTypingTest.ts` hook manages typing state, `useTimer.ts` manages countdown

### Key Types (`src/types/index.ts`)

- `Document`: Uploaded PDF with extracted text and optional AI-optimized text
- `TestResult`: WPM, accuracy, character counts for completed tests
- `TestMode`: 30 | 60 | 120 seconds
- `TypingState`: Current word index, typed words history, correctness tracking

### Component Structure

- `App.tsx`: Main router between document list and typing test views
- `TypingTest/`: Test UI with `WordDisplay` (renders words with cursor), `Stats`, `Results`
- `PDFUpload/`: Drag-and-drop PDF upload
- `Settings/`: OpenAI API key and AI optimization toggle

### Styling

Tailwind CSS with custom theme in `tailwind.config.js`:
- Colors: `bg-primary`, `bg-secondary`, `text-primary`, `text-secondary`, `accent` (botanical green), `error`, `correct`
- Font: Roboto Mono

### Important Behaviors

- Typing test resets when mode changes (via React key prop)
- Backspace can navigate to previous words to fix mistakes
- Wrong characters remain visible (not auto-corrected)
- Stats are tracked per-character and recalculated when navigating back
