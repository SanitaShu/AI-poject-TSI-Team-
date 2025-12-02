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

  // Check if user is on checkout/payment pages (handle both with and without base path)
  const isCheckoutOrPayment = location.pathname.endsWith('/checkout') ||
                               location.pathname.endsWith('/review') ||
                               location.pathname.endsWith('/payment');

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

    // Manually load PayPal SDK with improved reliability
    const loadPayPalSDK = () => {
      // Check if already loaded
      const existingScript = document.querySelector('script[data-paypal-sdk]');
      if (existingScript) {
        console.log('✅ PayPal SDK script already exists');
        // Check if window.paypal is actually available
        if (window.paypal) {
          console.log('✅ PayPal SDK already loaded and ready');
          return;
        } else {
          console.log('⚠️  PayPal script exists but SDK not ready yet...');
        }
        return;
      }

      // Clean environment variables - remove ALL whitespace, quotes, and newlines
      const paypalClientId = String(import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test')
        .replace(/\s+/g, '') // Remove ALL whitespace including newlines
        .replace(/^["']|["']$/g, '') // Remove surrounding quotes
        .trim();

      const paypalMode = String(import.meta.env.VITE_PAYPAL_MODE || 'sandbox')
        .replace(/\s+/g, '') // Remove ALL whitespace
        .replace(/^["']|["']$/g, '')
        .trim();

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
      // Build URL carefully to avoid any formatting issues
      const sdkParams = new URLSearchParams({
        'client-id': paypalClientId,
        'currency': 'EUR',
        'intent': 'capture',
        'components': 'buttons,funding-eligibility'
      });
      const sdkUrl = `${paypalBaseUrl}/sdk/js?${sdkParams.toString()}`;
      script.src = sdkUrl;
      script.async = true;
      script.defer = true; // Also defer for better loading
      script.setAttribute('data-paypal-sdk', 'true'); // Safe marker (no special chars)

      console.log('📍 Full PayPal SDK URL:', sdkUrl);
      console.log('⏳ Loading PayPal SDK...');

      script.onload = () => {
        console.log(`✅ PayPal SDK loaded successfully from ${paypalBaseUrl}`);
        // Verify window.paypal is available
        if (window.paypal) {
          console.log('✅ window.paypal is ready!');
          console.log('💰 Available funding sources:', Object.keys(window.paypal.FUNDING || {}));
        } else {
          console.warn('⚠️  Script loaded but window.paypal is not available yet');
        }
      };

      script.onerror = (error) => {
        console.error('❌ Failed to load PayPal SDK:', error);
        console.error('   Check your internet connection and PayPal client ID');
      };

      // Append to head for faster loading
      document.head.appendChild(script);
    };

    loadPayPalSDK();
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
