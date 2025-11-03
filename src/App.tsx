import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { useIdleTimer } from './hooks/useIdleTimer';
import { useNavigate } from 'react-router-dom';

function AppContent() {
  const navigate = useNavigate();

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
