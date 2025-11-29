import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '../stores/appStore';
import { useTranslation } from '../hooks/useTranslation';

export function AdminLogin() {
  const navigate = useNavigate();
  const { setAdmin } = useAppStore();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      setAdmin(true);
      navigate('/admin/dashboard');
    } else {
      setError(t.adminLogin.invalidPassword);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
              <LockIcon className="w-8 h-8 text-secondary" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">
              {t.adminLogin.title}
            </h1>
            <p className="text-base text-muted-foreground">
              {t.adminLogin.subtitle}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-normal text-foreground mb-2">
                {t.adminLogin.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder={t.adminLogin.enterPassword}
                className="w-full h-14 px-6 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-14 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {t.adminLogin.login}
            </Button>

            <Button
              onClick={() => navigate('/')}
              className="w-full h-14 rounded-xl bg-muted text-muted-foreground hover:bg-muted/80"
            >
              {t.adminLogin.backToHome}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
