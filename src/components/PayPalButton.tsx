import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useAppStore } from '../stores/appStore';
import { medicines } from '../data/medicines';

interface PayPalButtonProps {
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
}

export function PayPalButton({ onSuccess, onError }: PayPalButtonProps) {
  const { selectedMedicines, processPurchase, addTransaction } = useAppStore();

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
      }}
    >
      <div className="w-full max-w-md">
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: 'EUR',
                    value: total.toFixed(2),
                    breakdown: {
                      item_total: {
                        currency_code: 'EUR',
                        value: total.toFixed(2),
                      },
                    },
                  },
                  description: 'OTC Medicine Vending Machine Purchase',
                  items: selectedMedicines.map((id) => {
                    const med = medicines.find((m) => m.id === id)!;
                    return {
                      name: med.shortName || med.name,
                      description: med.description.substring(0, 127),
                      unit_amount: {
                        currency_code: 'EUR',
                        value: med.priceWithVat.toFixed(2),
                      },
                      quantity: '1',
                      sku: med.productId,
                    };
                  }),
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              const order = await actions.order?.capture();

              if (order?.status === 'COMPLETED') {
                // Process purchase (deduct from inventory)
                const success = processPurchase(selectedMedicines);

                if (success) {
                  // Record transaction
                  addTransaction({
                    id: order.id || `TX-${Date.now()}`,
                    date: new Date(),
                    medicines: selectedMedicines.map((id) => {
                      const med = medicines.find((m) => m.id === id)!;
                      return {
                        id: med.id,
                        name: med.name,
                        quantity: 1,
                        price: med.priceWithVat,
                      };
                    }),
                    total,
                    paymentMethod: 'paypal',
                    status: 'completed',
                  });

                  onSuccess(order.id || 'unknown');
                } else {
                  onError('Some products are out of stock. Please refresh and try again.');
                }
              } else {
                onError('Payment was not completed. Please try again.');
              }
            } catch (err) {
              console.error('PayPal onApprove error:', err);
              onError('An error occurred during payment processing.');
            }
          }}
          onError={(err) => {
            console.error('PayPal Error:', err);
            onError('Payment failed. Please try again or contact support.');
          }}
          onCancel={() => {
            onError('Payment was cancelled.');
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
