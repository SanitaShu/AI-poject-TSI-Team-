import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2Icon, ShoppingBagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '../stores/appStore';
import { medicines } from '../data/medicines';
import { useTranslation } from '../hooks/useTranslation';

export function ReviewAndCheckoutPage() {
  const navigate = useNavigate();
  const { selectedMedicines, toggleMedicine } = useAppStore();
  const { t } = useTranslation();

  const selectedMedicineDetails = medicines.filter((med) =>
    selectedMedicines.includes(med.id)
  );

  // Prices displayed are WITH VAT (12%), so we reverse-calculate:
  const total = selectedMedicineDetails.reduce((sum, med) => sum + med.priceWithVat, 0);
  const subtotal = total / 1.12; // Base price before VAT
  const vat = total - subtotal; // VAT amount (12%)

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (selectedMedicines.length === 0) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-8 py-12">
        <Card className="p-12 text-center max-w-2xl">
          <ShoppingBagIcon className="w-24 h-24 mx-auto mb-6 text-muted-foreground" strokeWidth={1} />
          <h2 className="text-3xl font-heading font-semibold text-foreground mb-4">
            {t.checkout.emptyCart}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t.checkout.emptyCartMessage}
          </p>
          <Button
            onClick={() => navigate('/select-medicine')}
            className="h-14 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t.checkout.browseMedicines}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] px-8 py-12">
      <div className="container max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-heading font-semibold text-foreground mb-3">
              {t.checkout.reviewOrder}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.checkout.checkSelected}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {selectedMedicineDetails.map((medicine) => (
                <Card key={medicine.id} className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-lg bg-neutral-100 flex-shrink-0" />

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-heading font-medium text-foreground">
                          {medicine.name}
                        </h3>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                          {t.checkout.groupLabel.replace('{group}', medicine.group.toString())}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {medicine.description}
                      </p>
                      <p className="text-lg font-heading font-semibold text-primary">
                        €{medicine.priceWithVat.toFixed(2)}
                      </p>
                    </div>

                    <Button
                      onClick={() => toggleMedicine(medicine.id)}
                      className="h-12 w-12 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <Trash2Icon className="w-5 h-5" strokeWidth={2} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-8 sticky top-24 shadow-lg">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  {t.checkout.orderSummary}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">{t.checkout.subtotal}</span>
                    <span className="text-foreground font-normal">€{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">VAT (12%)</span>
                    <span className="text-foreground font-normal">€{vat.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-xl">
                    <span className="font-heading font-semibold text-foreground">{t.checkout.total}</span>
                    <span className="font-heading font-semibold text-primary">
                      €{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {t.checkout.proceedToCheckout}
                </Button>

                <Button
                  onClick={() => navigate('/select-medicine')}
                  className="w-full h-14 rounded-xl mt-4 bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  {t.checkout.addMoreItems}
                </Button>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
