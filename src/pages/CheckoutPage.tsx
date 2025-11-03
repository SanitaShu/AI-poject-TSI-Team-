import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, SmartphoneIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ModalPopup } from '../components/ModalPopup';
import { DispenseAnimation } from '../components/DispenseAnimation';
import { useAppStore } from '../stores/appStore';

type PaymentMethod = 'card' | 'mobile' | 'skip';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { clearCart } = useAppStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handlePayment = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 5000);
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
              Select your preferred payment method
            </p>
          </div>

          {!isProcessing && !isComplete && (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">
                  🔒 Secure Payment • All transactions are encrypted and protected
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
              <Card
                className="p-8 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handlePayment('card')}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCardIcon className="w-10 h-10 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-heading font-medium text-foreground">
                    Card / NFC
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Pay with credit card or tap your phone
                  </p>
                </div>
              </Card>

              <Card
                className="p-8 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handlePayment('mobile')}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                    <SmartphoneIcon className="w-10 h-10 text-accent" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-heading font-medium text-foreground">
                    Mobile Pay
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use Apple Pay, Google Pay, or Samsung Pay
                  </p>
                </div>
              </Card>

              <Card
                className="p-8 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handlePayment('skip')}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-secondary" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-heading font-medium text-foreground">
                    Skip (Demo)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Simulate payment for testing
                  </p>
                </div>
              </Card>
            </div>
            </>
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

      <ModalPopup
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Payment"
      >
        <div className="space-y-6">
          <p className="text-base text-foreground">
            Are you sure you want to proceed with{' '}
            {selectedMethod === 'card'
              ? 'Card/NFC'
              : selectedMethod === 'mobile'
              ? 'Mobile Pay'
              : 'Demo Mode'}
            ?
          </p>

          <div className="flex gap-4">
            <Button
              onClick={handleConfirm}
              className="flex-1 h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Confirm Payment
            </Button>

            <Button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 h-14 rounded-xl bg-muted text-muted-foreground hover:bg-muted/80"
            >
              Cancel
            </Button>
          </div>
        </div>
      </ModalPopup>
    </div>
  );
}
