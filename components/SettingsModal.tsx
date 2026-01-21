import React, { useState } from 'react';
import { X, Check, AlertCircle, Loader2, Key } from 'lucide-react';
import { validateApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onSave: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentApiKey, onSave }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    setError(null);
    setIsValidating(true);
    
    if (!apiKey.trim()) {
      setError("API Key cannot be empty");
      setIsValidating(false);
      return;
    }

    const isValid = await validateApiKey(apiKey);
    
    if (isValid) {
      onSave(apiKey);
      onClose();
    } else {
      setError("Invalid API Key. Please check your key and try again.");
    }
    setIsValidating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md border border-zinc-200 dark:border-zinc-800 p-6 transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Key className="text-purple-500" size={24} />
            Settings
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Gemini API Key
            </label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(null);
              }}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-zinc-900 dark:text-zinc-100 transition-all font-mono text-sm"
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Your key is stored locally on your device. Get one from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Google AI Studio</a>.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isValidating || !apiKey.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {isValidating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save Key
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;