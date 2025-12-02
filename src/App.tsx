import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { useIdleTimer } from './hooks/useIdleTimer';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import { initEmailJS } from './services/email';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { initializeInventory, initializeAllMachinesInventory } = useAppStore();

  // Initialize inventory on app load
  useEffect(() => {
    initializeInventory();
    initializeAllMachinesInventory();
  }, [initializeInventory, initializeAllMachinesInventory]);

  // Check if user is on checkout/payment pages
  const isCheckoutOrPayment = location.pathname === '/checkout' ||
                               location.pathname === '/review' ||
                               location.pathname === '/payment';

  // Idle timer - return to home after inactivity
  // Disabled during checkout/payment to allow time for PayPal
  useIdleTimer(() => {
    if (!isCheckoutOrPayment) {
      navigate('/');
    }
  }, 180000); // 3 minutes (180 seconds)

  return <AppRouter />;
}

function App() {
  // Initialize EmailJS on app mount
  useEffect(() => {
    initEmailJS();
    console.log('EmailJS initialized');
  }, []);

  // Get PayPal configuration from environment
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';
  const paypalMode = import.meta.env.VITE_PAYPAL_MODE || 'sandbox';

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: 'EUR',
        intent: 'capture',
        vault: paypalMode === 'sandbox' ? false : true,
        'buyer-country': 'LV',
        ...(paypalMode === 'sandbox' && {
          'data-sdk-integration-source': 'developer-studio',
        }),
      }}
      deferLoading={false}
    >
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
