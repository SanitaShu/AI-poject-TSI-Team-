import { useEffect, useRef, useState } from 'react';

interface ManualPayPalButtonsProps {
  total: number;
  onApprove: (orderId: string) => void;
  onError: (error: string) => void;
}

export function ManualPayPalButtons({ total, onApprove, onError }: ManualPayPalButtonsProps) {
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const cardButtonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [renderedButtons, setRenderedButtons] = useState<string[]>([]);

  useEffect(() => {
    // Wait for PayPal SDK to load
    const checkPayPalLoaded = setInterval(() => {
      if (window.paypal) {
        clearInterval(checkPayPalLoaded);

        // Shared button configuration
        const createButtonConfig = (fundingSource?: any) => ({
          fundingSource: fundingSource,
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            height: 48,
            label: fundingSource === window.paypal.FUNDING.CARD ? 'pay' : 'paypal',
            tagline: false,
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
        });

        const rendered: string[] = [];

        // Render PayPal button
        if (paypalButtonRef.current && window.paypal.FUNDING) {
          const isEligible = window.paypal.isFundingEligible(window.paypal.FUNDING.PAYPAL);
          console.log('PayPal funding eligible:', isEligible);

          if (isEligible) {
            window.paypal
              .Buttons(createButtonConfig(window.paypal.FUNDING.PAYPAL))
              .render(paypalButtonRef.current)
              .then(() => {
                console.log('✅ PayPal button rendered');
                rendered.push('PayPal');
                setRenderedButtons([...rendered]);
              })
              .catch((err: Error) => {
                console.error('Failed to render PayPal button:', err);
              });
          }
        }

        // Render Card button
        if (cardButtonRef.current && window.paypal.FUNDING) {
          const isEligible = window.paypal.isFundingEligible(window.paypal.FUNDING.CARD);
          console.log('Card funding eligible:', isEligible);

          if (isEligible) {
            window.paypal
              .Buttons(createButtonConfig(window.paypal.FUNDING.CARD))
              .render(cardButtonRef.current)
              .then(() => {
                console.log('✅ Card button rendered');
                rendered.push('Card');
                setRenderedButtons([...rendered]);
              })
              .catch((err: Error) => {
                console.error('Failed to render Card button:', err);
              });
          }
        }

        // Set loading to false after attempting to render
        setTimeout(() => {
          setIsLoading(false);
          if (rendered.length === 0) {
            setLoadError('No payment methods available. Please contact support.');
          }
        }, 1000);
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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* PayPal Button */}
      <div ref={paypalButtonRef} className="min-h-[48px]" />

      {/* Card Button */}
      <div ref={cardButtonRef} className="min-h-[48px]" />

      {renderedButtons.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔒 Secure Payment powered by <span className="font-semibold">PayPal</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Available: {renderedButtons.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

// Extend Window interface to include paypal
declare global {
  interface Window {
    paypal: any;
  }
}
