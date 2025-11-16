import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ZoomInIcon,
  ZoomOutIcon,
  MaximizeIcon,
  MinimizeIcon,
  DownloadIcon,
  FileTextIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ProfessionalPDFViewerProps {
  pdfUrl: string | null;
  medicineName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfessionalPDFViewer({
  pdfUrl,
  medicineName,
  isOpen,
  onClose,
}: ProfessionalPDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPageNumber(1);
      setScale(1.0);
      setIsFullscreen(false);
      setError(null);
    }
  }, [isOpen]);

  if (!pdfUrl) return null;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please try downloading instead.');
    setIsLoading(false);
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleFitToWidth = () => {
    setScale(1.0);
  };

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Enhanced glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[60]"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`pointer-events-auto ${
                isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[90vh]'
              } overflow-hidden`}
            >
              <Card className="bg-background shadow-2xl h-full flex flex-col">
                {/* Header with Toolbar */}
                <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground px-6 py-3 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileTextIcon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-heading font-semibold truncate">
                        Package Leaflet
                      </h2>
                      <p className="text-xs opacity-80 truncate">{medicineName}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleDownload}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 hover:bg-primary-foreground/20 text-primary-foreground"
                      title="Download PDF"
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Professional Toolbar */}
                <div className="bg-muted/30 border-b border-border px-4 py-2">
                  <div className="flex items-center justify-between">
                    {/* Navigation Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handlePreviousPage}
                        disabled={pageNumber <= 1}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Previous page"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-md border border-border">
                        <span className="text-sm font-medium">
                          {pageNumber}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {numPages || '...'}
                        </span>
                      </div>

                      <Button
                        onClick={handleNextPage}
                        disabled={pageNumber >= numPages}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Next page"
                      >
                        <ChevronRightIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleZoomOut}
                        disabled={scale <= 0.5}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Zoom out"
                      >
                        <ZoomOutIcon className="w-4 h-4" />
                      </Button>

                      <div className="px-3 py-1 bg-background rounded-md border border-border min-w-[60px] text-center">
                        <span className="text-sm font-medium">
                          {Math.round(scale * 100)}%
                        </span>
                      </div>

                      <Button
                        onClick={handleZoomIn}
                        disabled={scale >= 3.0}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Zoom in"
                      >
                        <ZoomInIcon className="w-4 h-4" />
                      </Button>

                      <Button
                        onClick={handleFitToWidth}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                        title="Fit to width"
                      >
                        Fit
                      </Button>

                      <Button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                      >
                        {isFullscreen ? (
                          <MinimizeIcon className="w-4 h-4" />
                        ) : (
                          <MaximizeIcon className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* PDF Viewer Area */}
                <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 overflow-auto custom-scrollbar">
                  <div className="flex justify-center p-6">
                    {error ? (
                      <div className="flex flex-col items-center justify-center gap-4 p-8 bg-background rounded-xl shadow-md">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                          <FileTextIcon className="w-8 h-8 text-destructive" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-2">Unable to Load PDF</h3>
                          <p className="text-sm text-muted-foreground mb-4 max-w-md">
                            {error}
                          </p>
                          <Button onClick={handleDownload}>
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            Download PDF Instead
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                        <Document
                          file={pdfUrl}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={onDocumentLoadError}
                          loading={
                            <div className="flex items-center justify-center p-12">
                              <div className="text-center">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-sm text-muted-foreground">Loading PDF...</p>
                              </div>
                            </div>
                          }
                        >
                          <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="pdf-page"
                          />
                        </Document>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-2 bg-muted/30 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p>Official package leaflet from Latvia's Medicine Registry (ZVA)</p>
                    <p>PDF Viewer powered by PDF.js</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
