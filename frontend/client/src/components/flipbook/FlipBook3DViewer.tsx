/**
 * 3D FlipBook Viewer Component
 * Provides realistic page-turning animation with 3D transforms
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FlipBookPage, FLIP_ANIMATION_DURATION } from '@/types/flipbook';
import { cn } from '@/lib/utils';

interface FlipBookViewerProps {
  pages: FlipBookPage[];
  currentPage: number;
  onPageChange: (page: number) => void;
  zoom?: number;
  className?: string;
  enableClickNavigation?: boolean;
  showNavigationHints?: boolean;
}

export default function FlipBook3DViewer({
  pages,
  currentPage,
  onPageChange,
  zoom = 100,
  className,
  enableClickNavigation = true,
  showNavigationHints = true,
}: FlipBookViewerProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward' | null>(null);
  const [hoveredZone, setHoveredZone] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get current page data (showing double-page spread)
  const leftPageIndex = Math.floor((currentPage - 1) / 2) * 2;
  const rightPageIndex = leftPageIndex + 1;

  const leftPage = pages[leftPageIndex];
  const rightPage = pages[rightPageIndex];
  const nextPage = pages[rightPageIndex + 1];
  const prevPage = leftPageIndex > 0 ? pages[leftPageIndex - 1] : null;

  const canGoNext = rightPageIndex < pages.length - 1;
  const canGoPrev = leftPageIndex > 0;

  // Handle page navigation
  const goToNextPage = useCallback(() => {
    if (canGoNext && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('forward');

      setTimeout(() => {
        onPageChange(currentPage + 2);
        setIsFlipping(false);
        setFlipDirection(null);
      }, FLIP_ANIMATION_DURATION);
    }
  }, [canGoNext, isFlipping, currentPage, onPageChange]);

  const goToPrevPage = useCallback(() => {
    if (canGoPrev && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('backward');

      setTimeout(() => {
        onPageChange(currentPage - 2);
        setIsFlipping(false);
        setFlipDirection(null);
      }, FLIP_ANIMATION_DURATION);
    }
  }, [canGoPrev, isFlipping, currentPage, onPageChange]);

  // Handle click zones
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enableClickNavigation || isFlipping) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickZone = clickX / rect.width;

      if (clickZone < 0.15 && canGoPrev) {
        goToPrevPage();
      } else if (clickZone > 0.85 && canGoNext) {
        goToNextPage();
      }
    },
    [enableClickNavigation, isFlipping, canGoPrev, canGoNext, goToPrevPage, goToNextPage]
  );

  // Handle mouse move for navigation hints
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!showNavigationHints || isFlipping) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const zone = mouseX / rect.width;

      if (zone < 0.15 && canGoPrev) {
        setHoveredZone('left');
      } else if (zone > 0.85 && canGoNext) {
        setHoveredZone('right');
      } else {
        setHoveredZone(null);
      }
    },
    [showNavigationHints, isFlipping, canGoPrev, canGoNext]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex items-center justify-center',
        'transition-all duration-300',
        className
      )}
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'center center',
      }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredZone(null)}
    >
      {/* Book Container with 3D Perspective */}
      <div
        className="relative"
        style={{
          perspective: '2000px',
          perspectiveOrigin: 'center center',
        }}
      >
        {/* Book Wrapper */}
        <div
          className="relative flex"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Hardcover Back */}
          <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl" 
               style={{ transform: 'translateZ(-10px)' }} />

          {/* Left Page (Static) */}
          <div className="relative flex-1">
            {leftPage && (
              <div className="relative overflow-hidden rounded-l-lg bg-white shadow-xl">
                <img
                  src={leftPage.imageUrl}
                  alt={`Page ${leftPage.pageNumber}`}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
                {/* Page shadow */}
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-black/10 to-transparent" />
                {/* Page number */}
                <div className="absolute bottom-4 left-4 text-xs text-gray-500">
                  {leftPage.pageNumber}
                </div>
              </div>
            )}
          </div>

          {/* Center Spine */}
          <div className="w-2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 shadow-inner" />

          {/* Right Page (Animated) */}
          <div className="relative flex-1" style={{ transformStyle: 'preserve-3d' }}>
            <AnimatePresence mode="wait">
              {rightPage && !isFlipping && (
                <motion.div
                  key={`page-${rightPage.pageNumber}`}
                  initial={false}
                  className="relative overflow-hidden rounded-r-lg bg-white shadow-xl"
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={rightPage.imageUrl}
                    alt={`Page ${rightPage.pageNumber}`}
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                  {/* Page shadow */}
                  <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-black/10 to-transparent" />
                  {/* Page number */}
                  <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                    {rightPage.pageNumber}
                  </div>
                </motion.div>
              )}

              {/* Flipping Animation */}
              {isFlipping && (
                <motion.div
                  key={`flipping-${currentPage}-${flipDirection}`}
                  className="absolute inset-0"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  initial={{
                    rotateY: flipDirection === 'forward' ? 0 : -180,
                  }}
                  animate={{
                    rotateY: flipDirection === 'forward' ? -180 : 0,
                  }}
                  transition={{
                    duration: FLIP_ANIMATION_DURATION / 1000,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  {/* Front of flipping page */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-lg bg-white shadow-xl"
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {rightPage && (
                      <img
                        src={rightPage.imageUrl}
                        alt={`Page ${rightPage.pageNumber}`}
                        className="h-full w-full object-contain"
                        draggable={false}
                      />
                    )}
                  </div>

                  {/* Back of flipping page */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-lg bg-white shadow-xl"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    {flipDirection === 'forward' && nextPage && (
                      <img
                        src={nextPage.imageUrl}
                        alt={`Page ${nextPage.pageNumber}`}
                        className="h-full w-full object-contain"
                        draggable={false}
                      />
                    )}
                    {flipDirection === 'backward' && prevPage && (
                      <img
                        src={prevPage.imageUrl}
                        alt={`Page ${prevPage.pageNumber}`}
                        className="h-full w-full object-contain"
                        draggable={false}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Hints */}
        <AnimatePresence>
          {hoveredZone === 'left' && canGoPrev && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/90 p-3 text-primary-foreground shadow-lg"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.div>
          )}

          {hoveredZone === 'right' && canGoNext && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/90 p-3 text-primary-foreground shadow-lg"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient lighting effect */}
      <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-radial from-primary/5 via-transparent to-transparent" />
    </div>
  );
}
