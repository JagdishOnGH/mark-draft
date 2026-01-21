import React from 'react';
import { MarkdownFile } from '../types';
import { FileText, Plus, Trash2, X, FileCode } from 'lucide-react';

interface SidebarProps {
  files: MarkdownFile[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onCreateFile: () => void;
  onDeleteFile: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  files, 
  activeFileId, 
  onSelectFile, 
  onCreateFile, 
  onDeleteFile,
  isOpen,
  onClose
}) => {
  return (
    <>
       {/* Mobile Overlay with Blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed md:static inset-y-0 left-0 z-30
        w-72 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col h-full
      `}>
        {/* Header */}
        <div className="h-16 px-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100 font-bold text-lg tracking-tight">
            <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-1 rounded-md">
              <FileCode size={18} />
            </div>
            MarkDraft
          </div>
          <button 
            onClick={onClose} 
            className="md:hidden p-1.5 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Button */}
        <div className="p-4 shrink-0">
          <button
            onClick={() => { onCreateFile(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus size={16} />
            New Document
          </button>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider flex justify-between items-center">
            <span>Documents</span>
            <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full text-zinc-500">
              {files.length}
            </span>
          </div>
          
          {files.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-zinc-400 dark:text-zinc-600 text-sm mb-2">No documents yet.</p>
              <p className="text-zinc-300 dark:text-zinc-700 text-xs">Create one or drag & drop a file.</p>
            </div>
          ) : (
            files.map(file => (
              <div
                key={file.id}
                onClick={() => { onSelectFile(file.id); onClose(); }}
                className={`
                  group relative flex items-center justify-between py-2 px-3 rounded-md cursor-pointer transition-all duration-200 border border-transparent
                  ${activeFileId === file.id 
                    ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm z-10' 
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                  <FileText 
                    size={16} 
                    className={`shrink-0 transition-colors ${activeFileId === file.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 group-hover:text-zinc-500'}`} 
                  />
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <span className={`text-sm truncate leading-tight ${activeFileId === file.id ? 'font-medium text-zinc-900 dark:text-zinc-100' : ''}`}>
                      {file.title || 'Untitled'}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate mt-0.5">
                      {new Date(file.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => onDeleteFile(file.id, e)}
                  className={`
                    absolute right-2 p-1.5 rounded-md transition-all
                    text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
                    ${activeFileId === file.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100'}
                  `}
                  title="Delete document"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
           <div className="text-[10px] text-center text-zinc-400 leading-relaxed">
             Drop <strong>.md</strong> or <strong>.txt</strong> files to append<br/>
             Auto-saves to browser storage
           </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;