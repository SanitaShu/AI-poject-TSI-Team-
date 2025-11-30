import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, AlertCircleIcon, MailIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DispenseAnimation } from '../components/DispenseAnimation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAppStore } from '../stores/appStore';
import { useFaceRecognitionStore } from '../stores/faceRecognitionStore';
import { medicines } from '../data/medicines';
import { saveTransaction } from '../services/database';
import { sendPurchaseEmails } from '../services/email';
import { useTranslation } from '../hooks/useTranslation';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { selectedMedicines, clearCart, vendingMachineId, processPurchase, addTransaction } = useAppStore();
  const { cleanupExpiredData } = useFaceRecognitionStore();
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  // Cleanup expired face recognition data when component mounts
  useEffect(() => {
    cleanupExpiredData();
    // Set page title
    document.title = 'Checkout – Smart Medicine Vending';

    // Cleanup function to reset title when leaving page
    return () => {
      document.title = 'Smart Medicine Vending';
    };
  }, [cleanupExpiredData]);

  // Calculate total
  const total = selectedMedicines.reduce((sum, id) => {
    const medicine = medicines.find((m) => m.id === id);
    return sum + (medicine?.priceWithVat || 0);
  }, 0);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePaymentSuccess = async (orderId: string) => {
    console.log('Payment successful! Order ID:', orderId);
    setIsProcessing(true);
    setError(null);

    try {
      // Validate email is provided
      if (!email || !validateEmail(email)) {
        setError('Please provide a valid email address');
        setIsProcessing(false);
        return;
      }

      // Prepare transaction data
      const transactionId = `TXN-${Date.now()}`;
      const items = selectedMedicines.map((id) => {
        const medicine = medicines.find((m) => m.id === id);
        return {
          medicineId: id,
          medicineName: medicine?.shortName || 'Unknown',
          quantity: 1,
          price: medicine?.priceWithVat || 0,
        };
      });

      // Save transaction to database
      const dbResult = await saveTransaction({
        transactionId,
        customerEmail: email,
        total,
        paymentMethod: 'paypal',
        status: 'completed',
        vendingMachineId,
        items,
      });

      if (!dbResult.success) {
        console.error('Failed to save transaction to database:', dbResult.error);
      }

      // Add transaction to local store
      addTransaction({
        id: transactionId,
        date: new Date(),
        medicines: items.map((item) => ({
          id: item.medicineId,
          name: item.medicineName,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        paymentMethod: 'paypal',
        status: 'completed',
      });

      // Process purchase (update inventory)
      processPurchase(selectedMedicines);

      // Send emails (customer receipt + admin notification)
      const emailResult = await sendPurchaseEmails({
        transactionId,
        customerEmail: email,
        date: new Date().toLocaleString(),
        items: items.map((item) => ({
          name: item.medicineName,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        vendingMachineId,
      });

      if (emailResult.success) {
        console.log('✅ Emails sent successfully');
      }

      // Cleanup expired face recognition data after successful payment
      cleanupExpiredData();

      // Simulate dispensing animation
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
      }, 3000);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('An error occurred while processing your payment. Please contact support.');
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    clearCart();
    navigate('/');
  };

  // Get PayPal configuration from environment variables
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const paypalMode = import.meta.env.VITE_PAYPAL_MODE || 'sandbox'; // Default to sandbox for safety

  // Log PayPal configuration for debugging
  console.log('🔧 PayPal Configuration:');
  console.log('  Client ID:', paypalClientId ? `✅ ${paypalClientId}` : '❌ Missing');
  console.log('  Mode Variable:', paypalMode);
  console.log('  Expected Environment:', paypalMode === 'sandbox' ? '🧪 SANDBOX (Test Cards Work)' : '🔴 LIVE (Real Cards Only)');
  console.log('');
  console.log('⚠️ IMPORTANT: Check Network tab for PayPal SDK URL:');
  console.log('  ✅ Sandbox: https://www.sandbox.paypal.com/sdk/js...');
  console.log('  ❌ Live: https://www.paypal.com/sdk/js...');

  // Check if Client ID appears to be from sandbox (sandbox IDs are typically shorter)
  const isSandboxClientId = paypalClientId && (
    paypalClientId.startsWith('AW') ||
    paypalClientId.startsWith('Ab') ||
    paypalClientId.length < 100 // Sandbox IDs are usually shorter than live IDs
  );
  console.log('  Client ID Type:', isSandboxClientId ? '🧪 Appears to be SANDBOX' : '⚠️ Might be LIVE');

  return (
    <div className="min-h-[calc(100vh-180px)] px-4 sm:px-8 py-12">
      <div className="container max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Review & Checkout
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Proceed to Payment
            </p>
          </div>

          {!isProcessing && !isComplete && (
            <Card className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8">
              <div className="space-y-6">
                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    {selectedMedicines.map((id) => {
                      const med = medicines.find((m) => m.id === id);
                      if (!med) return null;
                      return (
                        <div key={id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{med.shortName}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            €{med.priceWithVat.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          Total (with VAT)
                        </span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          €{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    Please provide a valid email address
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="poweroftaj@gmail.com"
                      className={`w-full h-12 pl-11 pr-12 rounded-lg border ${
                        email && validateEmail(email)
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                      } text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    />
                    {email && validateEmail(email) && (
                      <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    📧 Receipt will be sent to this email • Admin will be notified at touficjandah@gmail.com
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Secure Payment Notice */}
                <div className="text-center py-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🔒 Secure Payment • All transactions are encrypted and protected
                  </p>
                </div>

                {/* PayPal Buttons */}
                {!email || !validateEmail(email) ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                      ⚠️ Please enter a valid email address to proceed with payment
                    </p>
                  </div>
                ) : !paypalClientId ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                    <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                      ⚠️ Payment system is not configured. Please contact the administrator.
                    </p>
                  </div>
                ) : (
                  <PayPalScriptProvider
                    options={{
                      clientId: paypalClientId,
                      currency: 'EUR',
                      intent: 'capture',
                      // CRITICAL: Enable sandbox mode and vault for card payments
                      vault: paypalMode === 'sandbox' ? false : true,
                      dataClientToken: undefined,
                      // Add buyer-country to help with sandbox testing
                      'buyer-country': 'US',
                      // Explicitly set sandbox environment
                      ...(paypalMode === 'sandbox' && {
                        'data-sdk-integration-source': 'developer-studio',
                      }),
                    }}
                  >
                    <div className="space-y-2">
                      <PayPalButtons
                        style={{
                          layout: 'vertical',
                          color: 'blue',
                          shape: 'rect',
                          label: 'paypal',
                          height: 48,
                        }}
                        fundingSource={undefined}
                        createOrder={(data, actions) => {
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
                        }}
                        onApprove={async (data, actions) => {
                          const order = await actions.order?.capture();
                          if (order?.status === 'COMPLETED') {
                            handlePaymentSuccess(order.id);
                          }
                        }}
                        onError={(err) => {
                          console.error('PayPal Error:', err);
                          setError('Payment was cancelled.');
                        }}
                        onCancel={() => {
                          setError('Payment was cancelled.');
                        }}
                      />
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Powered by <span className="font-semibold">PayPal</span>
                      </p>
                    </div>
                  </PayPalScriptProvider>
                )}

                {/* Back Button */}
                <div className="text-center pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/review')}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Processing Payment...
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
                    Please wait while we dispense your medicine
                  </p>
                </div>
                <DispenseAnimation />
              </div>
            </Card>
          )}

          {isComplete && (
            <Card className="p-12">
              <div className="text-center space-y-6">
                <CheckCircleIcon className="w-24 h-24 mx-auto text-green-500" strokeWidth={2} />
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  Payment Successful!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Thank you for your purchase
                </p>
                <Button
                  onClick={handleComplete}
                  className="h-14 px-12 text-lg rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  Back to Home
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
