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
  const { initializeInventory } = useAppStore();

  // Initialize inventory on app load
  useEffect(() => {
    initializeInventory();
  }, [initializeInventory]);

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

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
