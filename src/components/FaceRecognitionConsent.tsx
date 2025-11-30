import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, XIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '../hooks/useTranslation';

interface FaceRecognitionConsentProps {
  isOpen: boolean;
  onAgree: () => void;
  onCancel: () => void;
}

export function FaceRecognitionConsent({ isOpen, onAgree, onCancel }: FaceRecognitionConsentProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold text-foreground">
                    {t.faceConsent.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Purpose */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {t.faceConsent.purpose}
                  </p>
                </div>

                {/* What We Store */}
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {t.faceConsent.whatWeStore}
                  </h3>
                  <ul className="space-y-2 ml-4">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.faceConsent.facePhoto}</span>
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{t.faceConsent.timestamp}</span>
                    </li>
                  </ul>
                </div>

                {/* Storage Duration */}
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {t.faceConsent.storageDuration}
                  </h3>
                  <p className="text-sm text-muted-foreground ml-4">
                    {t.faceConsent.duration24h}
                  </p>
                </div>

                {/* Privacy Guarantees */}
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                    {t.faceConsent.notIdentified}
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    {t.faceConsent.noThirdParty}
                  </p>
                </div>

                {/* Confirmation Checklist */}
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4">
                    {t.faceConsent.confirmationTitle}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="w-3 h-3 text-primary" strokeWidth={3} />
                      </div>
                      <p className="text-sm text-foreground">{t.faceConsent.understandUsage}</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="w-3 h-3 text-primary" strokeWidth={3} />
                      </div>
                      <p className="text-sm text-foreground">{t.faceConsent.consentStorage}</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="w-3 h-3 text-primary" strokeWidth={3} />
                      </div>
                      <p className="text-sm text-foreground">{t.faceConsent.canWithdraw}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={onCancel}
                    variant="outline"
                    className="flex-1 h-14 text-base border-2 hover:bg-muted"
                  >
                    <XIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                    {t.faceConsent.cancel}
                  </Button>
                  <Button
                    onClick={onAgree}
                    className="flex-1 h-14 text-base bg-primary hover:bg-primary/90 shadow-lg"
                  >
                    <CheckIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                    {t.faceConsent.agree}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
