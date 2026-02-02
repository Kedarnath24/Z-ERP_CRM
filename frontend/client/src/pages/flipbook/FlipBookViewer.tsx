/**
 * FlipBook Viewer Page
 * Full-featured viewer with controls, thumbnails, search, and analytics
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Grid3x3,
  Search,
  Download,
  Share2,
  Settings,
  Home,
  SkipForward,
  SkipBack,
} from 'lucide-react';
import { FlipBookDocument, FlipBookViewerState, KEYBOARD_SHORTCUTS, ZOOM_LEVELS } from '@/types/flipbook';
import { getDocument, trackView, searchDocument } from '@/lib/flipbook-service';
import FlipBook3DViewer from '@/components/flipbook/FlipBook3DViewer';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlipBookViewer() {
  const [, params] = useRoute('/flipbook/viewer/:id');
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // State
  const [document, setDocument] = useState<FlipBookDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerState, setViewerState] = useState<FlipBookViewerState>({
    currentPage: 1,
    zoom: 100,
    isFullscreen: false,
    showThumbnails: false,
    showSearch: false,
    showSettings: false,
    autoPlay: false,
    selectedAnnotations: [],
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    pageNumber: number;
    matches: number;
    contexts: Array<{ text: string; position: number }>;
  }>>([]);
  const [searching, setSearching] = useState(false);

  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  const documentId = params?.id;

  // Load document
  useEffect(() => {
    if (!documentId) return;

    const loadDocument = async () => {
      try {
        setLoading(true);
        const doc = await getDocument(documentId);
        setDocument(doc);

        // Set initial zoom from settings
        setViewerState(prev => ({
          ...prev,
          zoom: doc.settings.defaultZoom,
        }));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load document',
          variant: 'destructive',
        });
        navigate('/flipbook');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId, toast, navigate]);

  // Track page views
  useEffect(() => {
    if (!document) return;

    trackView({
      documentId: document.id,
      pageNumber: viewerState.currentPage,
      timestamp: new Date().toISOString(),
      userId: 'current-user-id',
    });
  }, [document, viewerState.currentPage]);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    if (!viewerState.isFullscreen) {
      setControlsVisible(true);
      return;
    }

    const handleMouseMove = () => {
      setControlsVisible(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [viewerState.isFullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (KEYBOARD_SHORTCUTS.NEXT_PAGE.includes(e.key)) {
        e.preventDefault();
        goToNextPage();
      } else if (KEYBOARD_SHORTCUTS.PREV_PAGE.includes(e.key)) {
        e.preventDefault();
        goToPrevPage();
      } else if (KEYBOARD_SHORTCUTS.FIRST_PAGE.includes(e.key)) {
        e.preventDefault();
        goToPage(1);
      } else if (KEYBOARD_SHORTCUTS.LAST_PAGE.includes(e.key)) {
        e.preventDefault();
        goToPage(document?.totalPages || 1);
      } else if (KEYBOARD_SHORTCUTS.ZOOM_IN.includes(e.key)) {
        e.preventDefault();
        zoomIn();
      } else if (KEYBOARD_SHORTCUTS.ZOOM_OUT.includes(e.key)) {
        e.preventDefault();
        zoomOut();
      } else if (KEYBOARD_SHORTCUTS.RESET_ZOOM.includes(e.key)) {
        e.preventDefault();
        resetZoom();
      } else if (KEYBOARD_SHORTCUTS.TOGGLE_FULLSCREEN.includes(e.key)) {
        e.preventDefault();
        toggleFullscreen();
      } else if (KEYBOARD_SHORTCUTS.TOGGLE_THUMBNAILS.includes(e.key)) {
        e.preventDefault();
        toggleThumbnails();
      } else if (KEYBOARD_SHORTCUTS.TOGGLE_SEARCH.includes(e.key)) {
        e.preventDefault();
        toggleSearch();
      } else if (KEYBOARD_SHORTCUTS.ESCAPE.includes(e.key)) {
        if (viewerState.isFullscreen) {
          exitFullscreen();
        } else if (viewerState.showThumbnails) {
          setViewerState(prev => ({ ...prev, showThumbnails: false }));
        } else if (viewerState.showSearch) {
          setViewerState(prev => ({ ...prev, showSearch: false }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [document, viewerState]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (!document) return;
    const validPage = Math.max(1, Math.min(page, document.totalPages));
    setViewerState(prev => ({ ...prev, currentPage: validPage }));
  }, [document]);

  const goToNextPage = useCallback(() => {
    if (!document) return;
    goToPage(viewerState.currentPage + 2);
  }, [document, viewerState.currentPage, goToPage]);

  const goToPrevPage = useCallback(() => {
    if (!document) return;
    goToPage(viewerState.currentPage - 2);
  }, [document, viewerState.currentPage, goToPage]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(viewerState.zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setViewerState(prev => ({ ...prev, zoom: ZOOM_LEVELS[currentIndex + 1] }));
    }
  }, [viewerState.zoom]);

  const zoomOut = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(viewerState.zoom);
    if (currentIndex > 0) {
      setViewerState(prev => ({ ...prev, zoom: ZOOM_LEVELS[currentIndex - 1] }));
    }
  }, [viewerState.zoom]);

  const resetZoom = useCallback(() => {
    setViewerState(prev => ({ ...prev, zoom: 100 }));
  }, []);

  // Fullscreen functions
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      viewerContainerRef.current?.requestFullscreen();
      setViewerState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setViewerState(prev => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setViewerState(prev => ({ ...prev, isFullscreen: false }));
  }, []);

  // Panel toggles
  const toggleThumbnails = useCallback(() => {
    setViewerState(prev => ({ ...prev, showThumbnails: !prev.showThumbnails, showSearch: false }));
  }, []);

  const toggleSearch = useCallback(() => {
    setViewerState(prev => ({ ...prev, showSearch: !prev.showSearch, showThumbnails: false }));
  }, []);

  // Search function
  const handleSearch = useCallback(async () => {
    if (!document || !searchQuery.trim()) return;

    try {
      setSearching(true);
      const results = await searchDocument(document.id, searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Search failed',
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  }, [document, searchQuery, toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading FlipBook...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div
      ref={viewerContainerRef}
      className={cn(
        'relative flex h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20',
        viewerState.isFullscreen && 'bg-black'
      )}
    >
      {/* Header */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between border-b bg-card/95 backdrop-blur-sm px-6 py-4 z-50"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/flipbook')}
                title="Close viewer"
              >
                <X className="h-5 w-5" />
              </Button>

              <div>
                <h1 className="font-semibold text-lg">{document.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Page {viewerState.currentPage} of {document.totalPages}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {document.settings.allowDownload && (
                <Button variant="ghost" size="icon" title="Download">
                  <Download className="h-5 w-5" />
                </Button>
              )}

              {document.settings.allowShare && (
                <Button variant="ghost" size="icon" title="Share">
                  <Share2 className="h-5 w-5" />
                </Button>
              )}

              <Button
                variant={viewerState.isFullscreen ? 'default' : 'ghost'}
                size="icon"
                onClick={toggleFullscreen}
                title="Toggle fullscreen"
              >
                {viewerState.isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Viewer Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails Panel */}
        <AnimatePresence>
          {viewerState.showThumbnails && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="w-72 border-r bg-card/95 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-semibold">Pages</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewerState(prev => ({ ...prev, showThumbnails: false }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="grid grid-cols-2 gap-3 p-4">
                  {document.pages.map(page => (
                    <Card
                      key={page.pageNumber}
                      className={cn(
                        'cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary',
                        Math.floor((viewerState.currentPage - 1) / 2) * 2 === page.pageNumber - 1 &&
                          'ring-2 ring-primary'
                      )}
                      onClick={() => goToPage(page.pageNumber)}
                    >
                      <div className="relative aspect-[3/4] bg-muted">
                        <img
                          src={page.thumbnailUrl}
                          alt={`Page ${page.pageNumber}`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                          {page.pageNumber}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Search Panel */}
        <AnimatePresence>
          {viewerState.showSearch && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="w-80 border-r bg-card/95 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-semibold">Search</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewerState(prev => ({ ...prev, showSearch: false }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search in document..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searching && (
                  <div className="text-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Searching...</p>
                  </div>
                )}

                {!searching && searchResults.length > 0 && (
                  <ScrollArea className="h-[calc(100vh-12rem)]">
                    <div className="space-y-3">
                      {searchResults.map(result => (
                        <Card
                          key={result.pageNumber}
                          className="cursor-pointer p-3 hover:bg-muted/50 transition-colors"
                          onClick={() => goToPage(result.pageNumber)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">Page {result.pageNumber}</span>
                            <Badge variant="secondary">{result.matches} matches</Badge>
                          </div>
                          {result.contexts.slice(0, 2).map((context, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {context.text}
                            </p>
                          ))}
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {!searching && searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No results found</p>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* FlipBook Viewer */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <FlipBook3DViewer
            pages={document.pages}
            currentPage={viewerState.currentPage}
            onPageChange={goToPage}
            zoom={viewerState.zoom}
            className="max-w-full max-h-full"
          />
        </div>
      </div>

      {/* Control Bar */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.footer
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            className="border-t bg-card/95 backdrop-blur-sm px-6 py-4 z-50"
          >
            <div className="flex items-center justify-between">
              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(1)}
                  disabled={viewerState.currentPage === 1}
                  title="First page"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevPage}
                  disabled={viewerState.currentPage <= 1}
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2 px-4">
                  <Input
                    type="number"
                    min={1}
                    max={document.totalPages}
                    value={viewerState.currentPage}
                    onChange={e => goToPage(parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">of {document.totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={viewerState.currentPage >= document.totalPages - 1}
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(document.totalPages)}
                  disabled={viewerState.currentPage === document.totalPages}
                  title="Last page"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewerState.showThumbnails ? 'default' : 'outline'}
                  size="icon"
                  onClick={toggleThumbnails}
                  title="Toggle thumbnails (T)"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>

                <Button
                  variant={viewerState.showSearch ? 'default' : 'outline'}
                  size="icon"
                  onClick={toggleSearch}
                  title="Toggle search (S)"
                  disabled={!document.settings.enableSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-8" />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={zoomOut}
                  disabled={viewerState.zoom === ZOOM_LEVELS[0]}
                  title="Zoom out (-)"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>

                <span className="text-sm font-medium w-16 text-center">
                  {viewerState.zoom}%
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={zoomIn}
                  disabled={viewerState.zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                  title="Zoom in (+)"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}
