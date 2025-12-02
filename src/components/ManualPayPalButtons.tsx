import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

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
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);

  const loadPayPalButtons = () => {
    console.log('🔄 Attempting to load PayPal buttons...');
    setIsLoading(true);
    setLoadError(null);

    let checkCount = 0;
    const maxChecks = 100; // 10 seconds (100 * 100ms)

    const checkPayPalLoaded = setInterval(() => {
      checkCount++;

      if (!mountedRef.current) {
        clearInterval(checkPayPalLoaded);
        return;
      }

      if (window.paypal) {
        console.log('✅ PayPal SDK found!');
        clearInterval(checkPayPalLoaded);

        // Clear any existing buttons
        if (paypalButtonRef.current) paypalButtonRef.current.innerHTML = '';
        if (cardButtonRef.current) cardButtonRef.current.innerHTML = '';

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
        let renderAttempts = 0;

        // Render PayPal button
        if (paypalButtonRef.current && window.paypal.FUNDING) {
          const isEligible = window.paypal.isFundingEligible(window.paypal.FUNDING.PAYPAL);
          console.log('💰 PayPal funding eligible:', isEligible);

          if (isEligible) {
            renderAttempts++;
            window.paypal
              .Buttons(createButtonConfig(window.paypal.FUNDING.PAYPAL))
              .render(paypalButtonRef.current)
              .then(() => {
                console.log('✅ PayPal button rendered successfully');
                rendered.push('PayPal');
                setRenderedButtons((prev) => [...prev, 'PayPal']);
                checkRenderComplete();
              })
              .catch((err: Error) => {
                console.error('❌ Failed to render PayPal button:', err);
                checkRenderComplete();
              });
          }
        }

        // Render Card button
        if (cardButtonRef.current && window.paypal.FUNDING) {
          const isEligible = window.paypal.isFundingEligible(window.paypal.FUNDING.CARD);
          console.log('💳 Card funding eligible:', isEligible);

          if (isEligible) {
            renderAttempts++;
            window.paypal
              .Buttons(createButtonConfig(window.paypal.FUNDING.CARD))
              .render(cardButtonRef.current)
              .then(() => {
                console.log('✅ Card button rendered successfully');
                rendered.push('Card');
                setRenderedButtons((prev) => [...prev, 'Card']);
                checkRenderComplete();
              })
              .catch((err: Error) => {
                console.error('❌ Failed to render Card button:', err);
                checkRenderComplete();
              });
          }
        }

        let renderChecks = 0;
        function checkRenderComplete() {
          renderChecks++;
          if (renderChecks >= renderAttempts) {
            setTimeout(() => {
              setIsLoading(false);
              if (rendered.length === 0) {
                setLoadError('No payment methods available. Please try refreshing.');
              }
            }, 500);
          }
        }

        // Safety fallback - stop loading after 2 seconds
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);

      } else if (checkCount >= maxChecks) {
        console.error('❌ PayPal SDK failed to load after 10 seconds');
        clearInterval(checkPayPalLoaded);
        setLoadError('PayPal SDK failed to load. Please try refreshing the page.');
        setIsLoading(false);
      }
    }, 100);
  };

  useEffect(() => {
    mountedRef.current = true;
    setRenderedButtons([]);
    loadPayPalButtons();

    return () => {
      mountedRef.current = false;
    };
  }, [total, retryCount]);

  const handleRetry = () => {
    console.log('🔄 Manual retry triggered');
    setRetryCount((prev) => prev + 1);
  };

  if (loadError) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-3">{loadError}</p>
          <Button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            🔄 Retry Loading PayPal
          </Button>
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Having trouble? Make sure you have a stable internet connection and try refreshing the page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading payment options...</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This may take a few seconds</p>
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
            ✅ Available: {renderedButtons.join(' & ')}
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
