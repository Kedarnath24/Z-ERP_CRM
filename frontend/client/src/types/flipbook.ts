/**
 * FlipBook Module Type Definitions
 * Comprehensive types for the FlipBook ERP module
 */

export type FlipBookModuleType = 
  | 'invoice' 
  | 'contract' 
  | 'report' 
  | 'marketing' 
  | 'catalog'
  | 'training'
  | 'hr'
  | 'general';

export type FlipBookTheme = 'light' | 'dark' | 'auto';

export type FlipBookUploadStage = 
  | 'idle'
  | 'uploading' 
  | 'processing' 
  | 'converting' 
  | 'complete' 
  | 'error';

export type FlipBookShareMode = 'public' | 'private' | 'password-protected';

export interface FlipBookPage {
  pageNumber: number;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  text: string;
  annotations?: FlipBookAnnotation[];
}

export interface FlipBookAnnotation {
  id: string;
  type: 'highlight' | 'note' | 'link';
  pageNumber: number;
  position: { x: number; y: number };
  content: string;
  color?: string;
  createdBy: string;
  createdAt: string;
}

export interface FlipBookSettings {
  allowDownload: boolean;
  allowPrint: boolean;
  allowShare: boolean;
  autoFlip: boolean;
  flipDuration: number; // milliseconds
  defaultZoom: number; // percentage
  theme: FlipBookTheme;
  showPageNumbers: boolean;
  enableSearch: boolean;
  enableAnnotations: boolean;
  backgroundColor?: string;
}

export interface FlipBookDocument {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  totalPages: number;
  pages: FlipBookPage[];
  moduleType: FlipBookModuleType;
  organizationId: string;
  workspaceId?: string;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedAt: string;
  lastModified: string;
  settings: FlipBookSettings;
  tags?: string[];
  thumbnail?: string;
  analytics: FlipBookAnalytics;
  shareSettings?: FlipBookShareSettings;
}

export interface FlipBookAnalytics {
  totalViews: number;
  uniqueViewers: number;
  averageTimeSpent: number; // seconds
  pagesViewed: Record<number, number>;
  completionRate: number; // percentage
  lastViewedAt?: string;
  viewsByDate?: Record<string, number>;
  popularPages?: number[];
}

export interface FlipBookShareSettings {
  id: string;
  documentId: string;
  mode: FlipBookShareMode;
  password?: string;
  expiresAt?: string;
  maxViews?: number;
  currentViews: number;
  shareUrl: string;
  embedCode?: string;
  createdAt: string;
  createdBy: string;
}

export interface FlipBookUploadProgress {
  stage: FlipBookUploadStage;
  percentage: number;
  message: string;
  currentPage?: number;
  totalPages?: number;
  error?: string;
}

export interface FlipBookViewerState {
  currentPage: number;
  zoom: number;
  isFullscreen: boolean;
  showThumbnails: boolean;
  showSearch: boolean;
  showSettings: boolean;
  autoPlay: boolean;
  selectedAnnotations: string[];
}

export interface FlipBookSearchResult {
  pageNumber: number;
  matches: number;
  contexts: Array<{
    text: string;
    position: number;
  }>;
}

export interface FlipBookEmbedConfig {
  width?: string | number;
  height?: string | number;
  showControls?: boolean;
  showTitle?: boolean;
  autoStart?: boolean;
  startPage?: number;
  theme?: FlipBookTheme;
}

export interface FlipBookFilter {
  searchQuery?: string;
  moduleType?: FlipBookModuleType | 'all';
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  uploadedBy?: string;
  sortBy?: 'date' | 'name' | 'views' | 'size';
  sortOrder?: 'asc' | 'desc';
}

export interface FlipBookUploadRequest {
  file: File;
  title: string;
  description?: string;
  moduleType: FlipBookModuleType;
  organizationId: string;
  workspaceId?: string;
  tags?: string[];
  settings?: Partial<FlipBookSettings>;
}

export interface FlipBookUpdateRequest {
  title?: string;
  description?: string;
  moduleType?: FlipBookModuleType;
  tags?: string[];
  settings?: Partial<FlipBookSettings>;
}

export interface FlipBookViewEvent {
  documentId: string;
  pageNumber: number;
  timestamp: string;
  userId: string;
  duration?: number;
  shareToken?: string;
}

export interface FlipBookExportOptions {
  format: 'pdf' | 'images' | 'text';
  pageRange?: { start: number; end: number };
  quality?: 'low' | 'medium' | 'high';
  includeAnnotations?: boolean;
}

// Constants
export const DEFAULT_FLIPBOOK_SETTINGS: FlipBookSettings = {
  allowDownload: true,
  allowPrint: true,
  allowShare: true,
  autoFlip: false,
  flipDuration: 800,
  defaultZoom: 100,
  theme: 'auto',
  showPageNumbers: true,
  enableSearch: true,
  enableAnnotations: true,
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const SUPPORTED_MIME_TYPES = ['application/pdf'];
export const FLIP_ANIMATION_DURATION = 800; // milliseconds
export const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200, 300];
export const THUMBNAIL_SCALE = 0.15;
export const PAGE_IMAGE_QUALITY = 0.85;
export const THUMBNAIL_IMAGE_QUALITY = 0.6;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEXT_PAGE: ['ArrowRight', 'PageDown'],
  PREV_PAGE: ['ArrowLeft', 'PageUp'],
  FIRST_PAGE: ['Home'],
  LAST_PAGE: ['End'],
  ZOOM_IN: ['+', '='],
  ZOOM_OUT: ['-', '_'],
  RESET_ZOOM: ['0'],
  TOGGLE_FULLSCREEN: ['f', 'F11'],
  TOGGLE_THUMBNAILS: ['t'],
  TOGGLE_SEARCH: ['s'],
  ESCAPE: ['Escape'],
} as const;
