import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  PillIcon,
  FlaskConicalIcon,
  PackageIcon,
  ThermometerIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  FileTextIcon,
  CalendarIcon,
  HashIcon,
  BabyIcon,
  HelpCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PDFViewerModal } from './PDFViewerModal';
import type { Medicine } from '../data/medicines';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MedicineDetailModal({ medicine, isOpen, onClose }: MedicineDetailModalProps) {
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);

  if (!medicine) return null;

  // Generate expiry date (2 years from now as example)
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 2);
  const expiryString = expiryDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  // Generate batch number (example)
  const batchNumber = `LT${new Date().getFullYear()}-${medicine.productId.replace(/[^0-9]/g, '')}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Enhanced for better readability */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <Card className="bg-background shadow-2xl flex flex-col">
                {/* Header - Reduced height */}
                <div className="sticky top-0 bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between z-10 shadow-md">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Product Image/Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                      <PillIcon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-heading font-semibold mb-0.5 truncate">
                        {medicine.name}
                      </h2>
                      <p className="text-xs opacity-80 truncate">{medicine.shortName}</p>
                    </div>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-primary-foreground/20 text-primary-foreground flex-shrink-0"
                  >
                    <XIcon className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content - Custom Scrollbar */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6 custom-scrollbar">
                  {/* Price & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Price</div>
                      <div className="text-2xl font-heading font-bold text-primary">
                        €{medicine.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        €{medicine.priceWithVat.toFixed(2)} with VAT
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                      <div className="text-xs text-muted-foreground mb-1">Available Stock</div>
                      <div className="text-2xl font-heading font-bold text-accent">
                        {medicine.stock}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">units in stock</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <h3 className="text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <FileTextIcon className="w-5 h-5 text-primary" />
                      Description
                    </h3>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg">
                      <p className="text-sm text-foreground leading-relaxed">
                        {medicine.description}
                      </p>
                    </div>
                  </div>

                  {/* Active Substance */}
                  <div className="mt-6">
                    <h3 className="text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <FlaskConicalIcon className="w-5 h-5 text-primary" />
                      Active Ingredient
                    </h3>
                    <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                      <div className="grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800">
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Substance</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-sm text-foreground">{medicine.activeSubstance}</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Strength</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-sm text-foreground">{medicine.strength}</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Form</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-sm text-foreground">{medicine.pharmaceuticalForm}</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-xs font-medium text-muted-foreground uppercase">ATC Code</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-sm text-foreground font-mono">{medicine.atcCode}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Package & Manufacturer */}
                  <div className="mt-6">
                    <h3 className="text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <PackageIcon className="w-5 h-5 text-primary" />
                      Package Information
                    </h3>
                    <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                      <div className="grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800">
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Package Size</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-sm text-foreground">{medicine.packageSize}</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Manufacturer</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-sm text-foreground text-right">{medicine.manufacturer}</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Product ID</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-sm text-foreground font-mono">{medicine.productId}</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-xs font-medium text-muted-foreground uppercase">Authorization</span>
                        </div>
                        <div className="p-3 bg-white dark:bg-neutral-950">
                          <span className="text-sm text-foreground font-mono">{medicine.authorizationNo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expiry & Batch Information */}
                  <div className="mt-6">
                    <h3 className="text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Expiry & Batch
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                        <div className="text-xs text-muted-foreground mb-1">Expiry Date</div>
                        <div className="text-sm font-medium text-foreground">{expiryString}</div>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                        <div className="text-xs text-muted-foreground mb-1">Batch Number</div>
                        <div className="text-sm font-medium text-foreground font-mono">{batchNumber}</div>
                      </div>
                    </div>
                  </div>

                  {/* Storage Conditions */}
                  <div className="mt-6">
                    <h3 className="text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ThermometerIcon className="w-5 h-5 text-primary" />
                      Storage Conditions
                    </h3>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                      <p className="text-sm text-foreground">{medicine.storageConditions}</p>
                    </div>
                  </div>

                  {/* Safety Information */}
                  <div className="mt-6">
                    <h3 className="text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertCircleIcon className="w-5 h-5 text-primary" />
                      Safety Information
                    </h3>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg border ${
                        medicine.isApprovedForKids
                          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
                          : 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <BabyIcon className="w-4 h-4" />
                          <span className="text-sm font-medium text-foreground">
                            Pediatric Use
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {medicine.isApprovedForKids
                            ? 'This medication is approved for use in children.'
                            : 'This medication is not approved for children. Consult a healthcare professional.'}
                        </p>
                      </div>

                      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircleIcon className="w-4 h-4" />
                          <span className="text-sm font-medium text-foreground">Important Notice</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Always read the package leaflet carefully before use. If symptoms persist or worsen,
                          consult a healthcare professional. Do not exceed the recommended dose.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="mt-6">
                    <h3 className="text-base font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <HelpCircleIcon className="w-5 h-5 text-primary" />
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs font-medium text-foreground mb-1">Can I take this during pregnancy?</p>
                        <p className="text-xs text-muted-foreground">Consult your healthcare provider before use during pregnancy or breastfeeding.</p>
                      </div>
                      <div className="p-3 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs font-medium text-foreground mb-1">Can I take this with alcohol?</p>
                        <p className="text-xs text-muted-foreground">Avoid alcohol while taking this medication unless advised otherwise by your doctor.</p>
                      </div>
                      <div className="p-3 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs font-medium text-foreground mb-1">Does it cause drowsiness?</p>
                        <p className="text-xs text-muted-foreground">Check the package leaflet for side effects. Some medications may cause drowsiness.</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom padding for sticky button */}
                  <div className="h-20"></div>
                </div>

                {/* Sticky Footer Button */}
                {medicine.packageLeafletUrl && (
                  <div className="sticky bottom-0 p-4 bg-background border-t border-border shadow-lg">
                    <Button
                      onClick={() => setIsPDFViewerOpen(true)}
                      className="flex items-center justify-center gap-2 w-full p-4 h-auto bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-md"
                    >
                      <FileTextIcon className="w-5 h-5" />
                      <span className="font-medium">View Full Package Leaflet</span>
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* PDF Viewer Modal */}
          <PDFViewerModal
            pdfUrl={medicine.packageLeafletUrl}
            medicineName={medicine.name}
            isOpen={isPDFViewerOpen}
            onClose={() => setIsPDFViewerOpen(false)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
