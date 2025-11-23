import { motion } from 'framer-motion';
import { PillIcon } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export function DispenseAnimation() {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-64 bg-card border border-border rounded-2xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-full border-x-2 border-border/50">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 300, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute left-1/2 -translate-x-1/2"
            >
              <PillIcon className="w-8 h-8 text-accent" strokeWidth={2} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-accent/20 to-transparent" />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-lg font-heading font-medium text-foreground">{t.medicineDetails.dispensing}</p>
      </div>
    </div>
  );
}
