import { MarkdownFile } from '../types';

const STORAGE_KEY = 'markdraft_files';
const ACTIVE_FILE_KEY = 'markdraft_active_id';
const API_KEY_STORAGE_KEY = 'markdraft_api_key';

export const saveFiles = (files: MarkdownFile[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (e) {
    console.error("Failed to save files", e);
  }
};

export const loadFiles = (): MarkdownFile[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load files", e);
    return [];
  }
};

export const saveActiveFileId = (id: string) => {
  localStorage.setItem(ACTIVE_FILE_KEY, id);
};

export const loadActiveFileId = (): string | null => {
  return localStorage.getItem(ACTIVE_FILE_KEY);
};

export const saveApiKey = (key: string) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const loadApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const createNewFile = (): MarkdownFile => {
  return {
    id: generateId(),
    title: 'Untitled Document',
    content: '# New Document\n\nStart typing...',
    lastModified: Date.now(),
  };
};