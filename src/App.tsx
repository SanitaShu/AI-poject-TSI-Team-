import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { useIdleTimer } from './hooks/useIdleTimer';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import { initEmailJS } from './services/email';

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
  // Initialize EmailJS and PayPal SDK on app mount
  useEffect(() => {
    initEmailJS();
    console.log('EmailJS initialized');

    // Manually load PayPal SDK (safe - no querySelector errors)
    const loadPayPalSDK = () => {
      // Check if already loaded
      if (document.querySelector('script[data-paypal-sdk]')) {
        console.log('PayPal SDK already loaded');
        return;
      }

      // Clean environment variables - remove quotes, whitespace, and newlines
      const paypalClientId = (import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test')
        .toString()
        .trim()
        .replace(/^["']|["']$/g, ''); // Remove surrounding quotes
      const paypalMode = (import.meta.env.VITE_PAYPAL_MODE || 'sandbox')
        .toString()
        .trim()
        .replace(/^["']|["']$/g, ''); // Remove surrounding quotes

      // Use sandbox or live PayPal URL based on mode
      const paypalBaseUrl = paypalMode === 'sandbox'
        ? 'https://www.sandbox.paypal.com'
        : 'https://www.paypal.com';

      console.log('🔧 PayPal SDK Configuration:');
      console.log('  Mode:', paypalMode);
      console.log('  Base URL:', paypalBaseUrl);
      console.log('  Client ID:', paypalClientId ? '✅ Present' : '❌ Missing');
      console.log('  Client ID Length:', paypalClientId?.length);
      console.log('  Client ID (first 20 chars):', paypalClientId?.substring(0, 20));

      const script = document.createElement('script');
      // Enable both PayPal and card funding sources for sandbox
      // Note: In sandbox, cards are available by default. We explicitly enable additional funding sources.
      const sdkUrl = `${paypalBaseUrl}/sdk/js?client-id=${paypalClientId}&currency=EUR&intent=capture&components=buttons,funding-eligibility`;
      script.src = sdkUrl;
      script.async = true;
      script.setAttribute('data-paypal-sdk', 'true'); // Safe marker (no special chars)

      console.log('📍 Full PayPal SDK URL:', sdkUrl);

      script.onload = () => {
        console.log(`✅ PayPal SDK loaded successfully from ${paypalBaseUrl}`);
      };

      script.onerror = () => {
        console.error('❌ Failed to load PayPal SDK');
      };

      document.body.appendChild(script);
    };

    loadPayPalSDK();
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
