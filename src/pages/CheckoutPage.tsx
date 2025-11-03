import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DispenseAnimation } from '../components/DispenseAnimation';
import { PayPalButton } from '../components/PayPalButton';
import { useAppStore } from '../stores/appStore';
import { medicines } from '../data/medicines';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { selectedMedicines, clearCart } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total
  const total = selectedMedicines.reduce((sum, id) => {
    const medicine = medicines.find((m) => m.id === id);
    return sum + (medicine?.priceWithVat || 0);
  }, 0);

  const handlePaymentSuccess = (orderId: string) => {
    console.log('Payment successful! Order ID:', orderId);
    setIsProcessing(true);
    setError(null);

    // Simulate dispensing animation
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 5000);
  };

  const handlePaymentError = (errorMessage: string) => {
    console.error('Payment error:', errorMessage);
    setError(errorMessage);
    setIsProcessing(false);
  };

  const handleComplete = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-180px)] px-8 py-12">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-heading font-semibold text-foreground mb-3">
              Complete Your Purchase
            </h1>
            <p className="text-lg text-muted-foreground">
              Pay securely with PayPal
            </p>
          </div>

          {!isProcessing && !isComplete && (
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-muted/50 rounded-xl p-6">
                  <h3 className="text-lg font-heading font-medium mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    {selectedMedicines.map((id) => {
                      const med = medicines.find((m) => m.id === id);
                      if (!med) return null;
                      return (
                        <div key={id} className="flex justify-between items-center">
                          <span className="text-sm">{med.shortName}</span>
                          <span className="text-sm font-medium">€{med.priceWithVat.toFixed(2)}</span>
                        </div>
                      );
                    })}
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold">Total (VAT included)</span>
                        <span className="text-xl font-bold text-primary">€{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircleIcon className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-destructive">{error}</p>
                    </div>
                  </div>
                )}

                {/* PayPal Button */}
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">
                      🔒 Secure Payment • All transactions are encrypted and protected
                    </p>
                  </div>
                  <PayPalButton onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
                </div>

                <div className="text-center pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/review')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ← Back to Review
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {isProcessing && (
            <Card className="p-12">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-4">
                    Processing Payment...
                  </h2>
                  <p className="text-base text-muted-foreground mb-8">
                    Your medicines are being dispensed
                  </p>
                </div>

                <DispenseAnimation />
              </div>
            </Card>
          )}

          {isComplete && (
            <Card className="p-12 relative overflow-hidden">
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 50, rotate: 360 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent pointer-events-none"
              />
              
              <div className="text-center space-y-6 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    <CheckCircleIcon className="w-32 h-32 mx-auto text-success drop-shadow-2xl" strokeWidth={2} />
                  </motion.div>
                </motion.div>

                <div className="space-y-3">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-heading font-semibold text-foreground"
                  >
                    🎉 Purchase Complete!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-muted-foreground"
                  >
                    Thank you for your purchase. Please collect your medicines from the
                    dispensing tray below.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    onClick={handleComplete}
                    className="h-16 px-12 text-lg rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                  >
                    Return to Home
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 px-12 text-lg rounded-xl"
                  >
                    📧 Email Receipt
                  </Button>
                </motion.div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
