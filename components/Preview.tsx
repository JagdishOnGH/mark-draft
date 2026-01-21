import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewProps {
  content: string;
  className?: string;
  isDarkMode?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const Preview: React.FC<PreviewProps> = ({ content, className, isDarkMode = false, scrollRef, onScroll }) => {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className={`h-full overflow-y-auto p-4 md:p-8 bg-white dark:bg-zinc-900 ${className}`}
    >
      <div className="prose prose-zinc dark:prose-invert max-w-none break-words transition-colors duration-200">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Unwrap the default 'pre' to allow our 'code' component to control the block wrapper completely
            pre: ({ children }) => <>{children}</>,

            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const line = node?.position?.start?.line;

              if (!inline && match) {
                return (
                  <div data-source-line={line} className="relative group my-6 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-900/50">
                      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-medium">
                        {match[1].toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <SyntaxHighlighter
                        style={isDarkMode ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          padding: '1.5rem',
                          background: 'transparent',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                        }}
                        wrapLongLines={true}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                );
              }

              // Fallback for code blocks without language (still needs block styling)
              if (!inline) {
                return (
                  <div data-source-line={line} className="my-6 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/50 p-4 overflow-x-auto shadow-sm">
                    <code className="font-mono text-sm block" {...props}>
                      {children}
                    </code>
                  </div>
                )
              }

              // Inline code
              return (
                <code className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-sm font-mono text-pink-600 dark:text-pink-400 break-words" {...props}>
                  {children}
                </code>
              );
            },
            img({ node, ...props }) {
              const line = node?.position?.start?.line;
              return <img data-source-line={line} {...props} className="rounded-lg shadow-md max-w-full h-auto my-6 mx-auto" loading="lazy" alt={props.alt || 'Markdown image'} />;
            },
            a({ node, ...props }) {
              return <a {...props} className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-words" target="_blank" rel="noopener noreferrer" />;
            },
            blockquote({ node, ...props }) {
              const line = node?.position?.start?.line;
              return <blockquote data-source-line={line} {...props} className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 py-1 my-6 italic text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 pr-4 rounded-r" />;
            },
            table({ node, ...props }) {
              const line = node?.position?.start?.line;
              return (
                <div data-source-line={line} className="my-8 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <div className="overflow-x-auto">
                    <table {...props} className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700" />
                  </div>
                </div>
              );
            },
            h1: ({ node, ...props }) => <h1 data-source-line={node?.position?.start?.line} className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800" {...props} />,
            h2: ({ node, ...props }) => <h2 data-source-line={node?.position?.start?.line} className="text-2xl font-bold mt-8 mb-4" {...props} />,
            h3: ({ node, ...props }) => <h3 data-source-line={node?.position?.start?.line} className="text-xl font-bold mt-6 mb-3" {...props} />,
            h4: ({ node, ...props }) => <h4 data-source-line={node?.position?.start?.line} className="text-lg font-bold mt-6 mb-2" {...props} />,
            p: ({ node, ...props }) => <p data-source-line={node?.position?.start?.line} className="mb-4 leading-relaxed" {...props} />,
            ul: ({ node, ...props }) => <ul data-source-line={node?.position?.start?.line} className="list-disc list-outside ml-6 my-4 space-y-1" {...props} />,
            ol: ({ node, ...props }) => <ol data-source-line={node?.position?.start?.line} className="list-decimal list-outside ml-6 my-4 space-y-1" {...props} />,
            hr: ({ node, ...props }) => <hr data-source-line={node?.position?.start?.line} className="my-8 border-zinc-200 dark:border-zinc-800" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Preview;