import React, { useState, useEffect, useCallback } from 'react';
import { MarkdownFile, ViewMode } from './types';
import * as storage from './services/storageService';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SettingsModal from './components/SettingsModal';
import { UploadCloud } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize
  useEffect(() => {
    const loadedFiles = storage.loadFiles();
    const lastActiveId = storage.loadActiveFileId();
    const storedApiKey = storage.loadApiKey();
    
    // Theme init
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    
    if (storedApiKey) {
        setApiKey(storedApiKey);
    } else {
        // Automatically open settings if no key is found on first load (optional, but good UX for "mandated" settings)
        // setTimeout(() => setIsSettingsOpen(true), 1000);
    }

    if (loadedFiles.length > 0) {
      setFiles(loadedFiles);
      if (lastActiveId && loadedFiles.find(f => f.id === lastActiveId)) {
        setActiveFileId(lastActiveId);
      } else {
        setActiveFileId(loadedFiles[0].id);
      }
    } else {
      const newFile = storage.createNewFile();
      setFiles([newFile]);
      setActiveFileId(newFile.id);
    }
  }, []);

  // Persistence effects
  useEffect(() => {
    if (files.length > 0) storage.saveFiles(files);
  }, [files]);

  useEffect(() => {
    if (activeFileId) storage.saveActiveFileId(activeFileId);
  }, [activeFileId]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers
  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleUpdateContent = useCallback((content: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === activeFileId) {
        // Auto-generate title from first h1
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const newTitle = titleMatch ? titleMatch[1].trim() : f.title;
        return { ...f, content, title: newTitle, lastModified: Date.now() };
      }
      return f;
    }));
  }, [activeFileId]);

  const handleTitleChange = (newTitle: string) => {
    setFiles(prev => prev.map(f => 
      f.id === activeFileId ? { ...f, title: newTitle, lastModified: Date.now() } : f
    ));
  };

  const handleCreateFile = () => {
    const newFile = storage.createNewFile();
    // Add new file to the end of the list
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) {
        alert("Cannot delete the last file.");
        return;
    }
    const confirm = window.confirm("Are you sure you want to delete this file?");
    if (!confirm) return;

    setFiles(prev => {
        const remaining = prev.filter(f => f.id !== id);
        if (activeFileId === id) {
            setActiveFileId(remaining[0].id);
        }
        return remaining;
    });
  };

  const handleSaveApiKey = (key: string) => {
      setApiKey(key);
      storage.saveApiKey(key);
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    const mdFiles = droppedFiles.filter(f => f.name.endsWith('.md') || f.name.endsWith('.txt'));

    if (mdFiles.length === 0) return;

    const newFiles: MarkdownFile[] = [];
    
    for (const file of mdFiles) {
      const text = await file.text();
      newFiles.push({
        id: storage.generateId(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        content: text,
        lastModified: Date.now()
      });
    }

    // Append new files to the END of the list
    setFiles(prev => [...prev, ...newFiles]);
    
    // Only switch to the first new file if we currently have no files (rare case)
    // If a file is already open, we simply add the dragged files to the sidebar
    if (files.length === 0 && newFiles.length > 0) {
        setActiveFileId(newFiles[0].id);
    }
  };

  // View Logic
  const showEditor = viewMode === ViewMode.SPLIT || viewMode === ViewMode.EDITOR;
  const showPreview = viewMode === ViewMode.SPLIT || viewMode === ViewMode.PREVIEW;

  // Responsive check for split view
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768 && viewMode === ViewMode.SPLIT) {
            setViewMode(ViewMode.EDITOR);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  return (
    <div 
        className="flex h-screen w-full overflow-hidden bg-background text-foreground"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
      <Sidebar 
        files={files}
        activeFileId={activeFileId}
        onSelectFile={setActiveFileId}
        onCreateFile={handleCreateFile}
        onDeleteFile={handleDeleteFile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <TopBar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          currentContent={activeFile?.content || ''}
          onContentUpdate={handleUpdateContent}
          currentTitle={activeFile?.title || 'Untitled'}
          onTitleChange={handleTitleChange}
          apiKey={apiKey}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <div className="flex-1 flex overflow-hidden relative">
           {showEditor && (
             <div className={`${viewMode === ViewMode.SPLIT ? 'w-1/2 border-r border-zinc-200 dark:border-zinc-800' : 'w-full'}`}>
               <Editor 
                 value={activeFile?.content || ''} 
                 onChange={handleUpdateContent} 
               />
             </div>
           )}
           
           {showPreview && (
             <div className={`${viewMode === ViewMode.SPLIT ? 'w-1/2' : 'w-full'}`}>
               <Preview 
                 content={activeFile?.content || ''} 
                 isDarkMode={isDarkMode}
               />
             </div>
           )}
        </div>

        {/* Drag Overlay */}
        {isDragging && (
            <div className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm border-4 border-blue-500 border-dashed m-4 rounded-2xl flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 animate-pulse">
                <UploadCloud size={64} className="mb-4" />
                <h3 className="text-2xl font-bold">Drop Markdown Files Here</h3>
            </div>
        )}

        <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            currentApiKey={apiKey || ''}
            onSave={handleSaveApiKey}
        />
      </div>
    </div>
  );
}

export default App;