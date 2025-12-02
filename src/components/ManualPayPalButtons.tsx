import { useEffect, useRef, useState } from 'react';

interface ManualPayPalButtonsProps {
  total: number;
  onApprove: (orderId: string) => void;
  onError: (error: string) => void;
}

export function ManualPayPalButtons({ total, onApprove, onError }: ManualPayPalButtonsProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for PayPal SDK to load
    const checkPayPalLoaded = setInterval(() => {
      if (window.paypal && paypalRef.current) {
        clearInterval(checkPayPalLoaded);
        setIsLoading(false);

        // Render PayPal buttons using the global paypal object
        window.paypal
          .Buttons({
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
              height: 48,
            },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    amount: {
                      currency_code: 'EUR',
                      value: total.toFixed(2),
                    },
                  },
                ],
              });
            },
            onApprove: async (data: any, actions: any) => {
              try {
                const order = await actions.order.capture();
                if (order?.status === 'COMPLETED') {
                  onApprove(order.id);
                } else {
                  onError('Payment was not completed. Please try again.');
                }
              } catch (err) {
                console.error('PayPal onApprove error:', err);
                onError('An error occurred during payment processing.');
              }
            },
            onError: (err: any) => {
              console.error('PayPal Error:', err);
              onError('Payment failed. Please try again.');
            },
            onCancel: () => {
              onError('Payment was cancelled.');
            },
          })
          .render(paypalRef.current)
          .catch((err: Error) => {
            console.error('Failed to render PayPal buttons:', err);
            setLoadError('Failed to load PayPal buttons. Please refresh the page.');
          });
      }
    }, 100);

    // Cleanup: stop checking after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkPayPalLoaded);
      if (!window.paypal) {
        setLoadError('PayPal SDK failed to load. Please refresh the page.');
        setIsLoading(false);
      }
    }, 10000);

    return () => {
      clearInterval(checkPayPalLoaded);
      clearTimeout(timeout);
    };
  }, [total, onApprove, onError]);

  if (loadError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <p className="text-sm text-red-800 dark:text-red-200 font-medium">{loadError}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading PayPal...</p>
      </div>
    );
  }

  return (
    <div>
      <div ref={paypalRef} />
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        Powered by <span className="font-semibold">PayPal</span>
      </p>
    </div>
  );
}

// Extend Window interface to include paypal
declare global {
  interface Window {
    paypal: any;
  }
}
