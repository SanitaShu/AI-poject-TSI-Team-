import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, PillIcon, FlaskConicalIcon, PackageIcon, ThermometerIcon, AlertCircleIcon, ExternalLinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Medicine } from '../data/medicines';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MedicineDetailModal({ medicine, isOpen, onClose }: MedicineDetailModalProps) {
  if (!medicine) return null;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
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
              <Card className="bg-background shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-primary text-primary-foreground p-6 flex items-start justify-between z-10">
                  <div className="flex-1 pr-4">
                    <h2 className="text-2xl font-heading font-semibold mb-2">
                      {medicine.name}
                    </h2>
                    <p className="text-sm opacity-90">{medicine.shortName}</p>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  >
                    <XIcon className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
                  {/* Price & Stock */}
                  <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl">
                    <div>
                      <span className="text-3xl font-heading font-bold text-primary">
                        €{medicine.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        (€{medicine.priceWithVat.toFixed(2)} with VAT)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Available Stock</div>
                      <div className="text-2xl font-heading font-semibold text-accent">
                        {medicine.stock} units
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <PillIcon className="w-5 h-5 text-primary" />
                      Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {medicine.description}
                    </p>
                  </div>

                  <Separator />

                  {/* Active Substance */}
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <FlaskConicalIcon className="w-5 h-5 text-primary" />
                      Active Ingredient
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Substance:</span>
                        <span className="text-sm text-muted-foreground">{medicine.activeSubstance}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Strength:</span>
                        <span className="text-sm text-muted-foreground">{medicine.strength}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Form:</span>
                        <span className="text-sm text-muted-foreground">{medicine.pharmaceuticalForm}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">ATC Code:</span>
                        <span className="text-sm text-muted-foreground font-mono">{medicine.atcCode}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Package & Manufacturer */}
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <PackageIcon className="w-5 h-5 text-primary" />
                      Package Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Package Size:</span>
                        <span className="text-sm text-muted-foreground text-right">{medicine.packageSize}</span>
                      </div>
                      <div className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Manufacturer:</span>
                        <span className="text-sm text-muted-foreground text-right">{medicine.manufacturer}</span>
                      </div>
                      <div className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Product ID:</span>
                        <span className="text-sm text-muted-foreground font-mono">{medicine.productId}</span>
                      </div>
                      <div className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Authorization No:</span>
                        <span className="text-sm text-muted-foreground font-mono">{medicine.authorizationNo}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Storage Conditions */}
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ThermometerIcon className="w-5 h-5 text-primary" />
                      Storage Conditions
                    </h3>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                      <p className="text-sm text-foreground">{medicine.storageConditions}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Safety Information */}
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertCircleIcon className="w-5 h-5 text-primary" />
                      Safety Information
                    </h3>
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg border ${
                        medicine.isApprovedForKids
                          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
                          : 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            Pediatric Use:
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {medicine.isApprovedForKids
                            ? 'This medication is approved for use in children.'
                            : 'This medication is not approved for children. Consult a healthcare professional.'}
                        </p>
                      </div>

                      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
                        <p className="text-sm text-foreground font-medium mb-2">
                          ⚠️ Important Notice
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Always read the package leaflet carefully before use. If symptoms persist or worsen,
                          consult a healthcare professional. Do not exceed the recommended dose.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Package Leaflet Link */}
                  {medicine.packageLeafletUrl && (
                    <div>
                      <a
                        href={medicine.packageLeafletUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full p-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLinkIcon className="w-5 h-5" />
                        <span className="font-medium">View Full Package Leaflet</span>
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
