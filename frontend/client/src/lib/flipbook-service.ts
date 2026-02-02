/**
 * FlipBook API Service
 * Handles all API communications for the FlipBook module
 */

import {
  FlipBookDocument,
  FlipBookUploadProgress,
  FlipBookUploadRequest,
  FlipBookUpdateRequest,
  FlipBookShareSettings,
  FlipBookSearchResult,
  FlipBookEmbedConfig,
  FlipBookViewEvent,
  FlipBookAnalytics,
  FlipBookFilter,
  FlipBookExportOptions,
} from '@/types/flipbook';
import { processPDF, validatePDFFile } from './flipbook-pdf-processor';

// API Base URL - adjust according to your backend
const API_BASE_URL = '/api/flipbook';

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Common fetch options with authentication
 */
function getFetchOptions(method: string = 'GET', body?: any): RequestInit {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${getAuthToken()}`,
  };

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  };
}

/**
 * Handle API errors
 */
function handleError(error: any): never {
  console.error('FlipBook API Error:', error);
  throw new Error(error.message || 'An error occurred while processing your request');
}

/**
 * Upload a PDF file and create a new FlipBook document
 */
export async function uploadPDF(
  request: FlipBookUploadRequest,
  onProgress?: (progress: FlipBookUploadProgress) => void
): Promise<FlipBookDocument> {
  try {
    // Validate file
    const validation = validatePDFFile(request.file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Process PDF to extract pages
    const processedPDF = await processPDF(request.file, {
      onProgress,
      includeText: true,
    });

    // Generate unique document ID
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Create document object
    const document: FlipBookDocument = {
      id: documentId,
      title: request.title,
      description: request.description,
      fileName: request.file.name,
      fileSize: request.file.size,
      totalPages: processedPDF.pageCount,
      pages: processedPDF.pages,
      moduleType: request.moduleType,
      organizationId: request.organizationId,
      workspaceId: request.workspaceId,
      uploadedBy: 'current-user-id', // Get from auth context
      uploadedByName: 'Current User', // Get from auth context
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      settings: {
        allowDownload: true,
        allowPrint: true,
        allowShare: true,
        autoFlip: false,
        flipDuration: 800,
        defaultZoom: 100,
        theme: 'auto',
        showPageNumbers: true,
        enableSearch: true,
        enableAnnotations: false,
        ...request.settings,
      },
      tags: request.tags || [],
      thumbnail: processedPDF.pages[0]?.thumbnailUrl,
      analytics: {
        totalViews: 0,
        uniqueViewers: 0,
        averageTimeSpent: 0,
        pagesViewed: {},
        completionRate: 0,
      },
    };

    // In production, send to backend
    // For demo, store in localStorage
    saveDocumentLocally(document);

    return document;
  } catch (error) {
    onProgress?.({
      stage: 'error',
      percentage: 0,
      message: error instanceof Error ? error.message : 'Upload failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return handleError(error);
  }
}

/**
 * Get all FlipBook documents
 */
export async function getDocuments(filter?: FlipBookFilter): Promise<FlipBookDocument[]> {
  try {
    // In production, fetch from backend
    // For demo, get from localStorage
    const documents = getDocumentsFromLocalStorage();

    // Apply filters
    let filtered = documents;

    if (filter?.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        doc =>
          doc.title.toLowerCase().includes(query) ||
          doc.description?.toLowerCase().includes(query) ||
          doc.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filter?.moduleType && filter.moduleType !== 'all') {
      filtered = filtered.filter(doc => doc.moduleType === filter.moduleType);
    }

    if (filter?.tags && filter.tags.length > 0) {
      filtered = filtered.filter(doc =>
        filter.tags!.some(tag => doc.tags?.includes(tag))
      );
    }

    if (filter?.dateFrom) {
      filtered = filtered.filter(doc => doc.uploadedAt >= filter.dateFrom!);
    }

    if (filter?.dateTo) {
      filtered = filtered.filter(doc => doc.uploadedAt <= filter.dateTo!);
    }

    // Sort
    if (filter?.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (filter.sortBy) {
          case 'date':
            comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
            break;
          case 'name':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'views':
            comparison = a.analytics.totalViews - b.analytics.totalViews;
            break;
          case 'size':
            comparison = a.fileSize - b.fileSize;
            break;
        }

        return filter.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Get a single FlipBook document by ID
 */
export async function getDocument(documentId: string): Promise<FlipBookDocument> {
  try {
    // In production, fetch from backend
    const documents = getDocumentsFromLocalStorage();
    const document = documents.find(doc => doc.id === documentId);

    if (!document) {
      throw new Error('Document not found');
    }

    return document;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Update a FlipBook document
 */
export async function updateDocument(
  documentId: string,
  updates: FlipBookUpdateRequest
): Promise<FlipBookDocument> {
  try {
    const documents = getDocumentsFromLocalStorage();
    const index = documents.findIndex(doc => doc.id === documentId);

    if (index === -1) {
      throw new Error('Document not found');
    }

    const updatedDocument = {
      ...documents[index],
      ...updates,
      lastModified: new Date().toISOString(),
      settings: updates.settings
        ? { ...documents[index].settings, ...updates.settings }
        : documents[index].settings,
    };

    documents[index] = updatedDocument;
    localStorage.setItem('flipbook_documents', JSON.stringify(documents));

    return updatedDocument;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Delete a FlipBook document
 */
export async function deleteDocument(documentId: string): Promise<void> {
  try {
    const documents = getDocumentsFromLocalStorage();
    const filtered = documents.filter(doc => doc.id !== documentId);

    if (filtered.length === documents.length) {
      throw new Error('Document not found');
    }

    localStorage.setItem('flipbook_documents', JSON.stringify(filtered));
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Search within a document
 */
export async function searchDocument(
  documentId: string,
  query: string
): Promise<FlipBookSearchResult[]> {
  try {
    const document = await getDocument(documentId);
    const { searchInPages } = await import('./flipbook-pdf-processor');
    return searchInPages(document.pages, query);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Track a page view event
 */
export async function trackView(event: FlipBookViewEvent): Promise<void> {
  try {
    const documents = getDocumentsFromLocalStorage();
    const index = documents.findIndex(doc => doc.id === event.documentId);

    if (index !== -1) {
      const doc = documents[index];
      doc.analytics.totalViews++;
      doc.analytics.lastViewedAt = event.timestamp;

      // Track page views
      if (!doc.analytics.pagesViewed[event.pageNumber]) {
        doc.analytics.pagesViewed[event.pageNumber] = 0;
      }
      doc.analytics.pagesViewed[event.pageNumber]++;

      documents[index] = doc;
      localStorage.setItem('flipbook_documents', JSON.stringify(documents));
    }
  } catch (error) {
    console.error('Failed to track view:', error);
  }
}

/**
 * Get analytics for a document
 */
export async function getAnalytics(documentId: string): Promise<FlipBookAnalytics> {
  try {
    const document = await getDocument(documentId);
    return document.analytics;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Create a share link
 */
export async function createShareLink(
  documentId: string,
  config: Partial<FlipBookShareSettings>
): Promise<FlipBookShareSettings> {
  try {
    const shareId = `share-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const baseUrl = window.location.origin;

    const shareSettings: FlipBookShareSettings = {
      id: shareId,
      documentId,
      mode: config.mode || 'public',
      password: config.password,
      expiresAt: config.expiresAt,
      maxViews: config.maxViews,
      currentViews: 0,
      shareUrl: `${baseUrl}/flipbook/shared/${shareId}`,
      embedCode: generateEmbedCode(shareId, {
        width: '100%',
        height: '600px',
        showControls: true,
      }),
      createdAt: new Date().toISOString(),
      createdBy: 'current-user-id',
    };

    // Store share settings
    const shares = getShareSettingsFromLocalStorage();
    shares.push(shareSettings);
    localStorage.setItem('flipbook_shares', JSON.stringify(shares));

    return shareSettings;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Generate embed code for a document
 */
export function generateEmbedCode(
  shareId: string,
  config: FlipBookEmbedConfig
): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams();

  if (config.showControls !== undefined) params.set('controls', String(config.showControls));
  if (config.showTitle !== undefined) params.set('title', String(config.showTitle));
  if (config.autoStart) params.set('autostart', 'true');
  if (config.startPage) params.set('page', String(config.startPage));
  if (config.theme) params.set('theme', config.theme);

  const src = `${baseUrl}/flipbook/embed/${shareId}?${params.toString()}`;
  const width = typeof config.width === 'number' ? `${config.width}px` : config.width || '100%';
  const height = typeof config.height === 'number' ? `${config.height}px` : config.height || '600px';

  return `<iframe src="${src}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
}

/**
 * Export document
 */
export async function exportDocument(
  documentId: string,
  options: FlipBookExportOptions
): Promise<Blob> {
  try {
    const document = await getDocument(documentId);

    switch (options.format) {
      case 'pdf':
        // In production, convert back to PDF or return original
        throw new Error('PDF export not implemented in demo');

      case 'images':
        // Create a zip of images
        throw new Error('Image export not implemented in demo');

      case 'text':
        const { extractAllText } = await import('./flipbook-pdf-processor');
        const text = extractAllText(document.pages);
        return new Blob([text], { type: 'text/plain' });

      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    return handleError(error);
  }
}

// Helper functions for localStorage (demo only)
function saveDocumentLocally(document: FlipBookDocument): void {
  const documents = getDocumentsFromLocalStorage();
  documents.push(document);
  localStorage.setItem('flipbook_documents', JSON.stringify(documents));
}

function getDocumentsFromLocalStorage(): FlipBookDocument[] {
  const stored = localStorage.getItem('flipbook_documents');
  return stored ? JSON.parse(stored) : [];
}

function getShareSettingsFromLocalStorage(): FlipBookShareSettings[] {
  const stored = localStorage.getItem('flipbook_shares');
  return stored ? JSON.parse(stored) : [];
}
