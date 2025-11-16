import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ExternalLinkIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PDFViewerModalProps {
  pdfUrl: string | null;
  medicineName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PDFViewerModal({ pdfUrl, medicineName, isOpen, onClose }: PDFViewerModalProps) {
  const [viewerType, setViewerType] = useState<'direct' | 'google' | 'mozilla'>('google');
  const [hasError, setHasError] = useState(false);

  if (!pdfUrl) return null;

  // Encode the PDF URL for viewers
  const encodedUrl = encodeURIComponent(pdfUrl);

  // Different viewer options
  const getViewerUrl = () => {
    switch (viewerType) {
      case 'google':
        // Google Docs Viewer - works with most PDFs and prevents downloads
        return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
      case 'mozilla':
        // Mozilla PDF.js viewer - alternative option
        return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodedUrl}`;
      case 'direct':
      default:
        // Direct embedding - fastest but may download if server sends attachment header
        return `${pdfUrl}#view=FitH&toolbar=0`;
    }
  };

  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
  };

  const handleViewerChange = (type: 'direct' | 'google' | 'mozilla') => {
    setViewerType(type);
    setHasError(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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
              className="pointer-events-auto w-full max-w-6xl h-[90vh] overflow-hidden"
            >
              <Card className="bg-background shadow-2xl h-full flex flex-col">
                {/* Header */}
                <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-heading font-semibold truncate">
                        Package Leaflet
                      </h2>
                      <p className="text-sm opacity-80 truncate">{medicineName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleDownload}
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3 hover:bg-primary-foreground/20 text-primary-foreground"
                      title="Open in new tab"
                    >
                      <ExternalLinkIcon className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Open</span>
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                    >
                      <XIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Viewer Type Selector */}
                <div className="px-6 py-3 bg-muted/30 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewerChange('google')}
                        variant={viewerType === 'google' ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs"
                      >
                        Standard View
                      </Button>
                      <Button
                        onClick={() => handleViewerChange('mozilla')}
                        variant={viewerType === 'mozilla' ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs"
                      >
                        Alternative View
                      </Button>
                      <Button
                        onClick={() => handleViewerChange('direct')}
                        variant={viewerType === 'direct' ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs"
                      >
                        Direct View
                      </Button>
                    </div>
                    {hasError && (
                      <div className="flex items-center gap-2 text-xs text-orange-600">
                        <AlertCircleIcon className="w-4 h-4" />
                        <span>Try another viewer or download</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 p-4 overflow-hidden">
                  <div className="w-full h-full rounded-lg overflow-hidden shadow-inner bg-white">
                    {!hasError ? (
                      <iframe
                        key={viewerType}
                        src={getViewerUrl()}
                        className="w-full h-full border-0"
                        title={`Package Leaflet - ${medicineName}`}
                        onError={() => setHasError(true)}
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
                        <AlertCircleIcon className="w-16 h-16 text-muted-foreground" />
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-2">Unable to Display PDF</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            The PDF viewer encountered an error. Please try a different viewer or download the PDF.
                          </p>
                          <Button onClick={handleDownload} className="mt-2">
                            <ExternalLinkIcon className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-3 bg-muted/30 border-t border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Official package leaflet from Latvia's Medicine Registry (ZVA)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Viewer: {viewerType === 'google' ? 'Google Docs' : viewerType === 'mozilla' ? 'PDF.js' : 'Direct'}
                    </p>
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
