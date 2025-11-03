import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { useIdleTimer } from './hooks/useIdleTimer';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './stores/appStore';

function AppContent() {
  const navigate = useNavigate();
  const { initializeInventory } = useAppStore();

  // Initialize inventory on app load
  useEffect(() => {
    initializeInventory();
  }, [initializeInventory]);

  useIdleTimer(() => {
    navigate('/');
  }, 30000);

  return <AppRouter />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
