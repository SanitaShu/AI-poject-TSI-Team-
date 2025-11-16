import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, CheckIcon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '../stores/appStore';
import { MedicineDetailModal } from './MedicineDetailModal';
import type { Medicine } from '../data/medicines';

interface MedicineCardProps {
  id: string;
  name: string;
  price: number;
  group: number;
  image?: string;
  description?: string;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (id: string) => void;
  medicine?: Medicine;
}

export function MedicineCard({
  id,
  name,
  price,
  group,
  image,
  description,
  isSelected,
  isDisabled,
  onSelect,
  medicine,
}: MedicineCardProps) {
  const { getStock } = useAppStore();
  const stock = getStock(id);
  const isOutOfStock = stock <= 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        whileHover={!isDisabled && !isOutOfStock ? { scale: 1.02 } : {}}
        whileTap={!isDisabled && !isOutOfStock ? { scale: 0.98 } : {}}
        className="p-2"
      >
        <Card
          className={`relative overflow-hidden transition-all duration-200 ${
            isSelected
              ? 'ring-2 ring-accent shadow-lg bg-accent/5'
              : isDisabled || isOutOfStock
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-md cursor-pointer hover:border-accent/50'
          }`}
        >
        {isOutOfStock && !isSelected && (
          <div className="absolute inset-0 bg-destructive/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="text-xs font-medium text-destructive bg-background/90 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        {isDisabled && !isSelected && !isOutOfStock && (
          <div className="absolute inset-0 bg-neutral-900/5 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground bg-background/90 px-3 py-1 rounded-full">
              Group Limit Reached
            </span>
          </div>
        )}
        <div className="p-6">
          {/* Info Icon - Top Right */}
          <div className="absolute top-3 right-3 z-20">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground shadow-sm border border-border"
              title="View details"
            >
              <InfoIcon className="w-4 h-4" />
            </Button>
          </div>

          {image && (
            <div className="w-full h-32 mb-4 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-lg font-heading font-medium text-foreground line-clamp-2">
              {name}
            </h3>

            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <span className="text-xl font-heading font-semibold text-primary">
                  €{price.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Stock: {stock}
                </span>
              </div>

              <Button
                onClick={() => !isDisabled && !isOutOfStock && onSelect(id)}
                disabled={(isDisabled && !isSelected) || (isOutOfStock && !isSelected)}
                className={`h-12 w-12 rounded-lg ${
                  isSelected
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {isSelected ? (
                  <CheckIcon className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <PlusIcon className="w-5 h-5" strokeWidth={2} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>

    {/* Medicine Detail Modal */}
    <MedicineDetailModal
      medicine={medicine || null}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
  </>
  );
}
