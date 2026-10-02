export interface GuestbookEntry {
  id: string;
  timestamp: string;
  name: string;
  message: string;
  emoji?: string;
  tag?: string;
  likes?: number;
}

export type ConnectionMode = 'demo' | 'sheet';

export interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}
