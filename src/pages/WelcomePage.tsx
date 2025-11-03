import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, ShieldIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-8 py-12 relative overflow-hidden">
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(22, 163, 74, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-12"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-full max-w-2xl mx-auto h-96"
            >
              <img
                src="https://c.animaapp.com/mh6qjj17fjzQoj/img/ai_1.png"
                alt="Smart vending machine"
                className="w-full h-full object-contain drop-shadow-2xl"
                loading="eager"
              />
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-1 opacity-20 rounded-3xl blur-3xl"
              />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-heading font-semibold text-foreground">
              Welcome to Smart Medicine Vending
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your 24/7 AI-powered health assistant. Get personalized medicine recommendations
              and purchase safely with age verification.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              onClick={() => navigate('/verify-age')}
              className="h-16 px-12 text-lg rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
            >
              <ShoppingCartIcon className="w-6 h-6 mr-3" strokeWidth={2} />
              Start Purchase
            </Button>

            <Button
              onClick={() => navigate('/admin-login')}
              className="h-16 px-12 text-lg rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all hover:scale-105 shadow-lg"
            >
              <ShieldIcon className="w-6 h-6 mr-3" strokeWidth={2} />
              Admin Login
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-8 space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Age verification required for purchase • AI-powered recommendations • Secure payment
            </p>
            <p className="text-xs text-muted-foreground italic">
              ⚕️ For serious medical conditions, please consult your pharmacist or doctor
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
