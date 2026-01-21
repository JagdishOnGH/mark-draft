import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  scrollRef?: React.RefObject<HTMLTextAreaElement>;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement>) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange, className, scrollRef, onScroll }) => {
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <textarea
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 w-full h-full p-4 md:p-6 bg-transparent resize-none border-none outline-none font-mono text-sm md:text-base leading-relaxed text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:ring-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing your markdown here..."
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;