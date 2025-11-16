import { useState, useEffect } from 'react';
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  if (!pdfUrl) return null;

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

                {/* Info Bar */}
                <div className="bg-muted/30 border-b border-border px-4 py-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Use the PDF viewer controls below to navigate, zoom, and interact with the document
                    </p>
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

                {/* PDF Viewer Area */}
                <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  <div className="w-full h-full">
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                      className="w-full h-full border-0"
                      title="PDF Viewer"
                      style={{ minHeight: '600px' }}
                      allow="fullscreen"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-2 bg-muted/30 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p>Official package leaflet from Latvia's Medicine Registry (ZVA)</p>
                    <p>PDF Viewer powered by Google Docs</p>
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
