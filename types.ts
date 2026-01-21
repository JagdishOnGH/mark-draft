export interface MarkdownFile {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export enum ViewMode {
  SPLIT = 'SPLIT',
  EDITOR = 'EDITOR',
  PREVIEW = 'PREVIEW'
}

export interface AIResponse {
  text: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}