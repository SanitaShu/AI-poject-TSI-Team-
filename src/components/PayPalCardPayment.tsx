import { useState } from 'react';
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
} from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../stores/appStore';
import { medicines } from '../data/medicines';

interface PayPalCardPaymentProps {
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

export function PayPalCardPayment({ onSuccess, onError }: PayPalCardPaymentProps) {
  const { selectedMedicines } = useAppStore();
  const [isPaying, setIsPaying] = useState(false);

  // Calculate total (prices with VAT)
  const total = selectedMedicines.reduce((sum, id) => {
    const medicine = medicines.find((m) => m.id === id);
    return sum + (medicine?.priceWithVat || 0);
  }, 0);

  // Get PayPal client ID from environment variables
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        currency: 'EUR',
        intent: 'capture',
        components: 'card-fields',
      }}
    >
      <div className="w-full max-w-md mx-auto space-y-4">
        <PayPalCardFieldsProvider
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: 'EUR',
                    value: total.toFixed(2),
                  },
                  description: 'OTC Medicine Vending Machine Purchase',
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              setIsPaying(true);
              const order = await actions?.order?.capture();

              if (order?.status === 'COMPLETED') {
                onSuccess(order.id || 'unknown');
              } else {
                onError('Payment was not completed. Please try again.');
              }
            } catch (error) {
              console.error('Error capturing order:', error);
              onError('An error occurred during payment processing.');
            } finally {
              setIsPaying(false);
            }
          }}
          onError={(error) => {
            console.error('PayPal Card Error:', error);
            onError('Payment failed. Please check your card details and try again.');
            setIsPaying(false);
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Card Number</label>
              <div className="border border-input rounded-lg p-3 bg-background">
                <PayPalNumberField
                  style={{
                    input: {
                      'font-size': '16px',
                      'font-family': 'inherit',
                    },
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Test card: 4111 1111 1111 1111
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Expiry Date</label>
                <div className="border border-input rounded-lg p-3 bg-background">
                  <PayPalExpiryField
                    style={{
                      input: {
                        'font-size': '16px',
                        'font-family': 'inherit',
                      },
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">MM/YY (e.g., 12/30)</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">CVV</label>
                <div className="border border-input rounded-lg p-3 bg-background">
                  <PayPalCVVField
                    style={{
                      input: {
                        'font-size': '16px',
                        'font-family': 'inherit',
                      },
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">123</p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPaying}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPaying ? 'Processing Payment...' : `Pay €${total.toFixed(2)}`}
            </Button>
          </div>
        </PayPalCardFieldsProvider>
      </div>
    </PayPalScriptProvider>
  );
}
