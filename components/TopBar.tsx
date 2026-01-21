import React, { useState } from 'react';
import { ViewMode } from '../types';
import {
  Menu,
  Maximize,
  Columns,
  Edit3,
  Moon,
  Sun,
  Wand2,
  Loader2,
  Download,
  Settings,
  Link2,
  Unlink2
} from 'lucide-react';
import { generateAIContent } from '../services/geminiService';

interface TopBarProps {
  onToggleSidebar: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentContent: string;
  onContentUpdate: (newContent: string) => void;
  currentTitle: string;
  onTitleChange: (newTitle: string) => void;
  apiKey: string | null;
  onOpenSettings: () => void;
  isSyncScrollEnabled: boolean;
  onToggleSyncScroll: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  viewMode,
  setViewMode,
  isDarkMode,
  toggleTheme,
  currentContent,
  onContentUpdate,
  currentTitle,
  onTitleChange,
  apiKey,
  onOpenSettings,
  isSyncScrollEnabled,
  onToggleSyncScroll
}) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const handleAiAction = async () => {
    if (!aiPrompt.trim()) return;

    if (!apiKey) {
      onOpenSettings();
      setShowAiInput(false);
      return;
    }

    setIsAiLoading(true);
    try {
      const updated = await generateAIContent(apiKey, aiPrompt, currentContent);
      onContentUpdate(updated);
      setAiPrompt('');
      setShowAiInput(false);
    } catch (error) {
      console.error(error);
      alert("AI Error: Could not generate content. Please check your API key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentTitle.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 z-10 shrink-0">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <input
          value={currentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-transparent font-medium text-zinc-800 dark:text-zinc-200 outline-none text-sm md:text-base w-full max-w-[200px] md:max-w-md hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded px-2 py-1 transition-colors"
          placeholder="Document Title"
        />
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Sync Scroll Toggle */}
        <button
          onClick={onToggleSyncScroll}
          className={`p-2 rounded-lg transition-colors hidden md:block ${isSyncScrollEnabled ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          title={isSyncScrollEnabled ? "Disable Sync Scroll" : "Enable Sync Scroll"}
        >
          {isSyncScrollEnabled ? <Link2 size={20} /> : <Unlink2 size={20} />}
        </button>

        {/* View Mode Toggles (Desktop) */}
        <div className="hidden md:flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg mr-2">
          <button
            onClick={() => setViewMode(ViewMode.EDITOR)}
            className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.EDITOR ? 'bg-white dark:bg-zinc-700 shadow text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
            title="Editor Only"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => setViewMode(ViewMode.SPLIT)}
            className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.SPLIT ? 'bg-white dark:bg-zinc-700 shadow text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
            title="Split View"
          >
            <Columns size={16} />
          </button>
          <button
            onClick={() => setViewMode(ViewMode.PREVIEW)}
            className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.PREVIEW ? 'bg-white dark:bg-zinc-700 shadow text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
            title="Preview Only"
          >
            <Maximize size={16} />
          </button>
        </div>

        {/* Mobile View Toggle */}
        <button
          onClick={() => setViewMode(viewMode === ViewMode.EDITOR ? ViewMode.PREVIEW : ViewMode.EDITOR)}
          className="md:hidden p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
        >
          {viewMode === ViewMode.EDITOR ? <Maximize size={20} /> : <Edit3 size={20} />}
        </button>

        {/* AI Assistant */}
        <div className="relative">
          <button
            onClick={() => {
              if (!apiKey) {
                onOpenSettings();
              } else {
                setShowAiInput(!showAiInput);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${showAiInput || isAiLoading
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/50'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}
            `}
            title={apiKey ? "AI Assist" : "Configure AI Key"}
          >
            {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            <span className="hidden md:inline">AI Assist</span>
          </button>

          {showAiInput && apiKey && (
            <div className="absolute top-full right-0 mt-2 w-72 md:w-96 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl rounded-xl z-50">
              <div className="mb-2 text-xs font-semibold text-zinc-500">
                Ask Gemini to edit or improve your text
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Fix grammar, Summarize this, Convert to bullet points..."
                className="w-full h-24 p-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 mb-2 resize-none text-zinc-800 dark:text-zinc-200"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAiAction();
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAiInput(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAiAction}
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white hover:bg-purple-700 rounded-lg disabled:opacity-50"
                >
                  {isAiLoading ? 'Thinking...' : 'Generate'}
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleDownload}
          className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg hidden md:block"
          title="Download MD"
        >
          <Download size={20} />
        </button>

        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-lg transition-colors ${!apiKey ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          title="Settings & API Key"
        >
          <Settings size={20} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default TopBar;