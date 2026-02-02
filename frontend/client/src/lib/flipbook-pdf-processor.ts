/**
 * FlipBook PDF Processing Utility
 * Handles PDF file validation, page extraction, and text processing
 * Note: This uses the browser's built-in capabilities. For production,
 * consider using pdf.js library for better compatibility
 */

import {
  FlipBookPage,
  FlipBookUploadProgress,
  MAX_FILE_SIZE,
  SUPPORTED_MIME_TYPES,
  THUMBNAIL_SCALE,
  PAGE_IMAGE_QUALITY,
  THUMBNAIL_IMAGE_QUALITY,
} from '@/types/flipbook';

export interface PDFProcessorOptions {
  onProgress?: (progress: FlipBookUploadProgress) => void;
  includeText?: boolean;
  imageFormat?: 'jpeg' | 'png';
  maxWidth?: number;
  maxHeight?: number;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export interface ProcessedPDF {
  pages: FlipBookPage[];
  metadata: PDFMetadata;
  pageCount: number;
  fileSize: number;
}

/**
 * Validates a PDF file before processing
 */
export function validatePDFFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'File must be a PDF' };
  }

  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  return { valid: true };
}

/**
 * Simulates PDF processing for demo purposes
 * In production, implement actual PDF.js integration
 */
export async function processPDF(
  file: File,
  options: PDFProcessorOptions = {}
): Promise<ProcessedPDF> {
  const {
    onProgress,
    includeText = true,
    imageFormat = 'jpeg',
    maxWidth = 1200,
    maxHeight = 1600,
  } = options;

  // Report uploading stage
  onProgress?.({
    stage: 'uploading',
    percentage: 10,
    message: 'Uploading PDF file...',
  });

  // Simulate file reading
  await new Promise(resolve => setTimeout(resolve, 500));

  // Report processing stage
  onProgress?.({
    stage: 'processing',
    percentage: 30,
    message: 'Processing PDF document...',
  });

  // For demo purposes, generate mock pages
  // In production, use pdf.js to extract actual pages
  const mockPageCount = Math.floor(Math.random() * 20) + 10;
  const pages: FlipBookPage[] = [];

  // Report converting stage
  onProgress?.({
    stage: 'converting',
    percentage: 50,
    message: 'Converting pages to images...',
    totalPages: mockPageCount,
  });

  for (let i = 1; i <= mockPageCount; i++) {
    // Generate mock page data
    const page: FlipBookPage = {
      pageNumber: i,
      imageUrl: await generateMockPageImage(i, maxWidth, maxHeight, imageFormat),
      thumbnailUrl: await generateMockPageImage(
        i,
        Math.floor(maxWidth * THUMBNAIL_SCALE),
        Math.floor(maxHeight * THUMBNAIL_SCALE),
        imageFormat
      ),
      width: maxWidth,
      height: maxHeight,
      text: includeText ? generateMockPageText(i) : '',
    };

    pages.push(page);

    // Report progress
    const percentage = 50 + Math.floor((i / mockPageCount) * 40);
    onProgress?.({
      stage: 'converting',
      percentage,
      message: `Converting page ${i} of ${mockPageCount}...`,
      currentPage: i,
      totalPages: mockPageCount,
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Report completion
  onProgress?.({
    stage: 'complete',
    percentage: 100,
    message: 'PDF processing complete!',
  });

  const metadata: PDFMetadata = {
    title: file.name.replace('.pdf', ''),
    author: 'Unknown',
    creationDate: new Date(),
  };

  return {
    pages,
    metadata,
    pageCount: mockPageCount,
    fileSize: file.size,
  };
}

/**
 * Generates a mock page image (for demo purposes)
 * In production, render actual PDF pages using pdf.js
 */
async function generateMockPageImage(
  pageNumber: number,
  width: number,
  height: number,
  format: 'jpeg' | 'png'
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Draw page border
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Draw page number
  ctx.fillStyle = '#1f2937';
  ctx.font = `${Math.floor(height / 20)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(`Page ${pageNumber}`, width / 2, height / 2);

  // Draw some decorative elements
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  const lineSpacing = height / 15;
  for (let i = 0; i < 10; i++) {
    const y = height / 4 + i * lineSpacing;
    ctx.beginPath();
    ctx.moveTo(width / 4, y);
    ctx.lineTo((width * 3) / 4, y);
    ctx.stroke();
  }

  // Convert to data URL
  const quality = format === 'jpeg' ? PAGE_IMAGE_QUALITY : undefined;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  return canvas.toDataURL(mimeType, quality);
}

/**
 * Generates mock text content for a page
 */
function generateMockPageText(pageNumber: number): string {
  const paragraphs = [
    `This is page ${pageNumber} of the document. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.`,
    `Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
  ];

  return paragraphs.join('\n\n');
}

/**
 * Search for text within pages
 */
export function searchInPages(
  pages: FlipBookPage[],
  query: string
): Array<{
  pageNumber: number;
  matches: number;
  contexts: Array<{ text: string; position: number }>;
}> {
  if (!query.trim()) {
    return [];
  }

  const results: Array<{
    pageNumber: number;
    matches: number;
    contexts: Array<{ text: string; position: number }>;
  }> = [];

  const searchTerm = query.toLowerCase();

  pages.forEach(page => {
    const text = page.text.toLowerCase();
    const matches: Array<{ text: string; position: number }> = [];

    let position = 0;
    while ((position = text.indexOf(searchTerm, position)) !== -1) {
      // Extract context around the match (50 chars before and after)
      const start = Math.max(0, position - 50);
      const end = Math.min(text.length, position + searchTerm.length + 50);
      const context = page.text.substring(start, end);

      matches.push({
        text: (start > 0 ? '...' : '') + context + (end < text.length ? '...' : ''),
        position,
      });

      position += searchTerm.length;
    }

    if (matches.length > 0) {
      results.push({
        pageNumber: page.pageNumber,
        matches: matches.length,
        contexts: matches,
      });
    }
  });

  return results;
}

/**
 * Extract text from all pages
 */
export function extractAllText(pages: FlipBookPage[]): string {
  return pages.map(page => `--- Page ${page.pageNumber} ---\n${page.text}`).join('\n\n');
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate thumbnail grid for preview
 */
export function generateThumbnailGrid(
  pages: FlipBookPage[],
  columns: number = 4
): FlipBookPage[][] {
  const grid: FlipBookPage[][] = [];
  for (let i = 0; i < pages.length; i += columns) {
    grid.push(pages.slice(i, i + columns));
  }
  return grid;
}

/**
 * Calculate optimal page dimensions based on viewport
 */
export function calculatePageDimensions(
  viewportWidth: number,
  viewportHeight: number,
  originalWidth: number,
  originalHeight: number,
  padding: number = 40
): { width: number; height: number; scale: number } {
  const availableWidth = viewportWidth - padding * 2;
  const availableHeight = viewportHeight - padding * 2;

  const widthScale = availableWidth / originalWidth;
  const heightScale = availableHeight / originalHeight;
  const scale = Math.min(widthScale, heightScale, 1);

  return {
    width: originalWidth * scale,
    height: originalHeight * scale,
    scale,
  };
}
