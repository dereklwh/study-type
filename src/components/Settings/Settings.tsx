import { useState } from 'react';
import type { Settings as SettingsType } from '../../types';
import { initializeOpenAI } from '../../services/aiService';

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (updates: Partial<SettingsType>) => void;
  onClose: () => void;
}

const DEFAULT_BG = '#323437';
const DEFAULT_ACCENT = '#5d8a66';

export function Settings({ settings, onUpdate, onClose }: SettingsProps) {
  const [apiKey, setApiKey] = useState(settings.openaiApiKey || '');
  const [bgPrimary, setBgPrimary] = useState(settings.bgPrimary || DEFAULT_BG);
  const [accent, setAccent] = useState(settings.accent || DEFAULT_ACCENT);
  const [colorsSaved, setColorsSaved] = useState(false);

  const handleSaveApiKey = () => {
    if (apiKey) {
      initializeOpenAI(apiKey);
      onUpdate({ openaiApiKey: apiKey });
    }
  };

  const handleSaveColors = () => {
    onUpdate({ bgPrimary: bgPrimary || DEFAULT_BG, accent: accent || DEFAULT_ACCENT });
    setColorsSaved(true);
    setTimeout(() => setColorsSaved(false), 2000);
  };

  const handleResetColors = () => {
    setBgPrimary(DEFAULT_BG);
    setAccent(DEFAULT_ACCENT);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-secondary rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-text-secondary text-sm mb-2">
              OpenAI API Key
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 bg-bg-primary text-text-primary px-4 py-2 rounded border border-text-secondary/30 focus:border-accent outline-none"
              />
              <button
                onClick={handleSaveApiKey}
                className="bg-accent text-bg-primary px-4 py-2 rounded hover:opacity-90"
              >
                Save
              </button>
            </div>
            <p className="text-text-secondary text-xs mt-1">
              Required for AI text optimization
            </p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.useAiOptimization}
                onChange={(e) => onUpdate({ useAiOptimization: e.target.checked })}
                className="w-5 h-5 accent-accent"
              />
              <span className="text-text-primary">Use AI optimization for text</span>
            </label>
            <p className="text-text-secondary text-xs mt-1 ml-8">
              Extract key concepts and optimize text for learning
            </p>
          </div>

          <div className="border-t border-text-secondary/20 pt-6">
            <h3 className="text-text-primary font-medium mb-4">Color Scheme</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgPrimary}
                    onChange={(e) => setBgPrimary(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgPrimary}
                    onChange={(e) => setBgPrimary(e.target.value)}
                    className="flex-1 bg-bg-primary text-text-primary px-4 py-2 rounded border border-text-secondary/30 focus:border-accent outline-none font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="flex-1 bg-bg-primary text-text-primary px-4 py-2 rounded border border-text-secondary/30 focus:border-accent outline-none font-mono text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveColors}
                  style={{ backgroundColor: accent }}
                  className="text-white px-4 py-2 rounded hover:opacity-90"
                >
                  {colorsSaved ? 'Saved!' : 'Save Colors'}
                </button>
                <button
                  onClick={handleResetColors}
                  className="text-text-secondary text-sm hover:text-text-primary"
                >
                  Reset to defaults
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 bg-bg-primary text-text-primary py-3 rounded hover:bg-opacity-80 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
