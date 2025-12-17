import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, AlertCircleIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MedicineCard } from '../components/MedicineCard';
import { useAppStore } from '../stores/appStore';
import { useFaceRecognitionStore } from '../stores/faceRecognitionStore';
import { medicines, medicineGroups } from '../data/medicines';
import { useTranslation } from '../hooks/useTranslation';
import { getTimeRemainingForCategory } from '../utils/faceRecognition';

export function SelectMedicinePage() {
  const navigate = useNavigate();
  const { selectedMedicines, toggleMedicine } = useAppStore();
  const { currentUserId, blockedCategories, userRecords } = useFaceRecognitionStore();
  const { t } = useTranslation();

  const getMedicinesByGroup = (group: number) => {
    return medicines.filter((med) => med.group === group);
  };

  const isGroupSelected = (group: number) => {
    return medicines
      .filter((med) => med.group === group)
      .some((med) => selectedMedicines.includes(med.id));
  };

  const isGroupBlocked = (groupId: number): boolean => {
    return blockedCategories.includes(groupId);
  };

  const getTimeRemainingForGroup = (groupId: number): string => {
    if (!currentUserId) return '';

    const user = userRecords.find((u) => u.id === currentUserId);
    if (!user) return '';

    // Find the most recent purchase in this category
    const categoryPurchases = user.purchaseHistory.filter(
      (p) => p.categoryId === groupId
    );

    if (categoryPurchases.length === 0) return '';

    // Get the most recent purchase
    const mostRecent = categoryPurchases.reduce((latest, current) =>
      current.purchaseDate > latest.purchaseDate ? current : latest
    );

    return getTimeRemainingForCategory(mostRecent.purchaseDate);
  };

  const handleContinue = () => {
    if (selectedMedicines.length > 0) {
      navigate('/review');
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] px-8 py-12">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {currentUserId && (
            <Alert className="bg-accent/10 border-accent">
              <AlertCircleIcon className="h-5 w-5 text-accent" />
              <AlertDescription className="text-foreground">
                <strong>{t.purchaseRestrictions.welcomeBack}</strong>{' '}
                {t.purchaseRestrictions.restrictionInfo}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-semibold text-foreground mb-3">
                {t.medicineSelection.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {t.medicineSelection.subtitleGroups}
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                  {t.medicineSelection.safetyNotice}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((group) => (
                    <div
                      key={group}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                        medicines
                          .filter((med) => med.group === group)
                          .some((med) => selectedMedicines.includes(med.id))
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {group}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {t.medicineSelection.selectedGroups.replace('{count}', selectedMedicines.length.toString())}
                </span>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={selectedMedicines.length === 0}
              className="h-14 px-8 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 sticky top-24 shadow-lg"
            >
              <ShoppingCartIcon className="w-5 h-5 mr-3" strokeWidth={2} />
              {t.medicineSelection.continueCount.replace('{count}', selectedMedicines.length.toString())}
            </Button>
          </div>

          <Accordion type="multiple" defaultValue={['group-1']} className="space-y-4">
            {medicineGroups.map((group) => {
              const groupMedicines = getMedicinesByGroup(group.id);
              const groupSelected = isGroupSelected(group.id);
              const isBlocked = isGroupBlocked(group.id);
              const timeRemaining = isBlocked ? getTimeRemainingForGroup(group.id) : '';

              return (
                <AccordionItem
                  key={group.id}
                  value={`group-${group.id}`}
                  className={`border border-border rounded-2xl overflow-hidden ${
                    isBlocked ? 'bg-muted/50 opacity-60' : 'bg-card'
                  }`}
                >
                  <AccordionTrigger
                    className="px-8 py-6 hover:no-underline hover:bg-muted/50 transition-colors"
                    disabled={isBlocked}
                  >
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${
                          isBlocked ? 'bg-destructive/10' : 'bg-primary/10'
                        } flex items-center justify-center`}>
                          <span className={`text-xl font-heading font-semibold ${
                            isBlocked ? 'text-destructive' : 'text-primary'
                          }`}>
                            {group.id}
                          </span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-heading font-medium text-foreground">
                            {group.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isBlocked && (
                          <Badge variant="destructive" className="flex items-center gap-2">
                            <ClockIcon className="w-3 h-3" />
                            {t.purchaseRestrictions.timeRemaining.replace('{time}', timeRemaining)}
                          </Badge>
                        )}
                        {groupSelected && !isBlocked && (
                          <span className="px-4 py-2 rounded-lg bg-accent/10 text-accent text-sm font-normal flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            {t.medicineSelection.selected}
                          </span>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-8 pb-8">
                    {isBlocked ? (
                      <div className="py-8 text-center">
                        <AlertCircleIcon className="w-16 h-16 mx-auto text-destructive mb-4" />
                        <h4 className="text-lg font-medium text-foreground mb-2">
                          {t.purchaseRestrictions.categoryBlocked}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {t.purchaseRestrictions.timeRemaining.replace('{time}', timeRemaining)}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                        {groupMedicines.map((medicine) => (
                          <MedicineCard
                            key={medicine.id}
                            id={medicine.id}
                            name={medicine.name}
                            price={medicine.price}
                            group={medicine.group}
                            description={medicine.description}
                            isSelected={selectedMedicines.includes(medicine.id)}
                            isDisabled={groupSelected && !selectedMedicines.includes(medicine.id)}
                            onSelect={toggleMedicine}
                            medicine={medicine}
                          />
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
