import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  PackageIcon,
  TrendingUpIcon,
  FileTextIcon,
  AlertCircleIcon,
  HelpCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  WrenchIcon,
  ActivityIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '../stores/appStore';
import { vendingMachineLocations } from '../data/vendingMachines';
import { medicines } from '../data/medicines';
import { recipes } from '../data/vendingMachines';
import { useTranslation } from '../hooks/useTranslation';

export function AdminPanelPage() {
  const { t } = useTranslation();
  const { allMachinesInventory, transactions, getMachineInventory, restockMachineProduct } = useAppStore();
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Function to view machine details
  const viewMachineDetails = (machineId: string) => {
    setSelectedMachine(machineId);
    setActiveTab('inventory');
  };

  // Get stock alert level for a specific item
  const getStockAlert = (stock: number): 'critical' | 'warning' | 'good' => {
    if (stock <= 10) return 'critical';
    if (stock <= 20) return 'warning';
    return 'good';
  };

  // Count critical and warning items for a machine
  const getAlertCounts = (machineId: string) => {
    const inventory = getMachineInventory(machineId);
    const critical = inventory.filter((item) => item.stock <= 10).length;
    const warning = inventory.filter((item) => item.stock > 10 && item.stock <= 20).length;
    return { critical, warning };
  };

  // Calculate total stock value across all machines
  const getTotalStockValue = () => {
    let total = 0;
    allMachinesInventory.forEach((machine) => {
      machine.inventory.forEach((item) => {
        const medicine = medicines.find((m) => m.id === item.medicineId);
        if (medicine) {
          total += medicine.price * item.stock;
        }
      });
    });
    return total;
  };

  return (
    <div className="min-h-[calc(100vh-180px)] px-8 py-12 bg-background">
      <div className="container max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-semibold text-foreground mb-3">
                {t.admin.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t.admin.subtitle}
              </p>
            </div>

            <div className="flex gap-4">
              <Card className="px-6 py-4">
                <div className="text-sm text-muted-foreground">{t.admin.totalMachines}</div>
                <div className="text-2xl font-semibold text-foreground">
                  {vendingMachineLocations.length}
                </div>
              </Card>
              <Card className="px-6 py-4">
                <div className="text-sm text-muted-foreground">{t.admin.stockValue}</div>
                <div className="text-2xl font-semibold text-foreground">
                  ${getTotalStockValue().toFixed(2)}
                </div>
              </Card>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-3xl grid-cols-5 h-14">
              <TabsTrigger value="overview" className="text-base">
                <ActivityIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                {t.admin.overview}
              </TabsTrigger>
              <TabsTrigger value="locations" className="text-base">
                <MapPinIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                {t.admin.locations}
              </TabsTrigger>
              <TabsTrigger value="inventory" className="text-base">
                <PackageIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                {t.admin.inventory}
              </TabsTrigger>
              <TabsTrigger value="purchases" className="text-base">
                <TrendingUpIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                {t.admin.purchases}
              </TabsTrigger>
              <TabsTrigger value="recipes" className="text-base">
                <FileTextIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                {t.admin.recipes}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {vendingMachineLocations.map((machine) => {
                  const alerts = getAlertCounts(machine.id);
                  return (
                    <Card key={machine.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{machine.name}</h3>
                          <p className="text-sm text-muted-foreground">{machine.id}</p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            machine.status === 'active'
                              ? 'bg-green-500/20 text-green-700'
                              : machine.status === 'maintenance'
                              ? 'bg-yellow-500/20 text-yellow-700'
                              : 'bg-red-500/20 text-red-700'
                          }`}
                        >
                          {machine.status === 'active' && <CheckCircleIcon className="w-3 h-3 inline mr-1" />}
                          {machine.status === 'maintenance' && <WrenchIcon className="w-3 h-3 inline mr-1" />}
                          {machine.status === 'offline' && <XCircleIcon className="w-3 h-3 inline mr-1" />}
                          {t.admin[machine.status as keyof typeof t.admin]}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <MapPinIcon className="w-4 h-4 inline mr-1" />
                          {machine.city}, {machine.region}
                        </div>
                        <div className="text-xs text-muted-foreground">{machine.address}</div>

                        <div className="flex gap-4 pt-3 border-t border-border">
                          {alerts.critical > 0 && (
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertCircleIcon className="w-5 h-5" />
                              <span className="text-sm font-medium">{alerts.critical} {t.admin.critical}</span>
                            </div>
                          )}
                          {alerts.warning > 0 && (
                            <div className="flex items-center gap-2 text-yellow-600">
                              <HelpCircleIcon className="w-5 h-5" />
                              <span className="text-sm font-medium">{alerts.warning} {t.admin.warning}</span>
                            </div>
                          )}
                          {alerts.critical === 0 && alerts.warning === 0 && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircleIcon className="w-5 h-5" />
                              <span className="text-sm font-medium">{t.admin.allGood}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => viewMachineDetails(machine.id)}
                          className="w-full mt-4 h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {t.admin.viewDetails}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Locations Tab with Map */}
            <TabsContent value="locations" className="space-y-4">
              <Card className="p-8">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  {t.admin.vendingMachineLocations}
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {vendingMachineLocations.map((machine) => {
                      const alerts = getAlertCounts(machine.id);
                      return (
                        <div
                          key={machine.id}
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                          onClick={() => viewMachineDetails(machine.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">{machine.name}</h3>
                              <p className="text-sm text-muted-foreground">{machine.city}, {machine.region}</p>
                              <p className="text-xs text-muted-foreground">{machine.address}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {machine.latitude.toFixed(4)}, {machine.longitude.toFixed(4)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {alerts.critical > 0 && (
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                  <AlertCircleIcon className="w-5 h-5 text-red-600" />
                                </div>
                              )}
                              {alerts.warning > 0 && (
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                  <HelpCircleIcon className="w-5 h-5 text-yellow-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">{t.admin.interactiveMap}</h3>
                      <p className="text-muted-foreground">
                        {t.admin.mapIntegration}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {t.admin.locationsCount.replace('{count}', vendingMachineLocations.length.toString())}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4">
              <div className="flex gap-4 mb-6">
                <select
                  className="h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={selectedMachine || ''}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                >
                  <option value="">{t.admin.selectMachine}</option>
                  {vendingMachineLocations.map((machine) => (
                    <option key={machine.id} value={machine.id}>
                      {machine.name} ({machine.id})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMachine && (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                            {t.admin.medicine}
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                            {t.admin.stock}
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                            {t.admin.price}
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                            {t.admin.status}
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                            {t.admin.actions}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {getMachineInventory(selectedMachine).map((item) => {
                          const medicine = medicines.find((m) => m.id === item.medicineId);
                          const alert = getStockAlert(item.stock);
                          return (
                            <tr key={item.medicineId} className="hover:bg-muted/50">
                              <td className="px-6 py-4 text-sm text-foreground">
                                <div>
                                  <div className="font-medium">{medicine?.name}</div>
                                  <div className="text-muted-foreground text-xs">{medicine?.id}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground">
                                <div className="flex items-center gap-2">
                                  {alert === 'critical' && (
                                    <AlertCircleIcon className="w-5 h-5 text-red-600" />
                                  )}
                                  {alert === 'warning' && (
                                    <HelpCircleIcon className="w-5 h-5 text-yellow-600" />
                                  )}
                                  <span className={alert === 'critical' ? 'text-red-600 font-semibold' : ''}>
                                    {item.stock} {t.common.units}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground">
                                ${medicine?.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {alert === 'critical' && (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-700">
                                    {t.admin.critical}
                                  </span>
                                )}
                                {alert === 'warning' && (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-700">
                                    {t.admin.lowStock}
                                  </span>
                                )}
                                {alert === 'good' && (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-700">
                                    {t.admin.good}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <Button
                                  onClick={() => restockMachineProduct(selectedMachine, item.medicineId, 50)}
                                  className="h-10 px-4 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
                                >
                                  {t.admin.restock}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {!selectedMachine && (
                <Card className="p-12 text-center">
                  <PackageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    {t.admin.selectMachineInventory}
                  </p>
                </Card>
              )}
            </TabsContent>

            {/* Purchases Tab */}
            <TabsContent value="purchases" className="space-y-4">
              <Card className="overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-2xl font-heading font-semibold text-foreground">{t.admin.purchaseHistory}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.admin.allTransactions.replace('{count}', vendingMachineLocations.length.toString())}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          {t.admin.transactionId}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          {t.admin.machine}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">{t.admin.date}</th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">{t.admin.items}</th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">{t.admin.total}</th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">{t.admin.status}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                            {t.admin.noTransactions}
                          </td>
                        </tr>
                      ) : (
                        transactions.slice(0, 20).map((transaction) => {
                          const machine = vendingMachineLocations.find(
                            (m) => m.id === transaction.vendingMachineId
                          );
                          return (
                            <tr key={transaction.id} className="hover:bg-muted/50">
                              <td className="px-6 py-4 text-sm font-mono text-foreground">
                                {transaction.id}
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground">
                                {machine?.name || transaction.vendingMachineId}
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground">
                                {new Date(transaction.date).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground">
                                {transaction.medicines.length} {transaction.medicines.length === 1 ? t.checkout.item : t.checkout.items}
                              </td>
                              <td className="px-6 py-4 text-sm text-foreground font-medium">
                                ${transaction.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    transaction.status === 'completed'
                                      ? 'bg-green-500/20 text-green-700'
                                      : transaction.status === 'pending'
                                      ? 'bg-yellow-500/20 text-yellow-700'
                                      : 'bg-red-500/20 text-red-700'
                                  }`}
                                >
                                  {t.admin[transaction.status as keyof typeof t.admin]}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Recipes Tab */}
            <TabsContent value="recipes" className="space-y-4">
              <Card className="overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-2xl font-heading font-semibold text-foreground">
                    {t.admin.prescriptionManagement}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t.admin.managePrescriptions}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          {t.admin.recipeId}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          {t.admin.patient}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          {t.admin.doctor}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">{t.admin.date}</th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          {t.admin.medications}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          {t.admin.status}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          {t.admin.actions}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recipes.map((recipe) => (
                        <tr key={recipe.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 text-sm font-mono text-foreground">{recipe.id}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{recipe.patientName}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{recipe.doctorName}</td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {new Date(recipe.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {recipe.medications.length} {recipe.medications.length === 1 ? t.admin.medicine : t.admin.medications}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                recipe.status === 'fulfilled'
                                  ? 'bg-green-500/20 text-green-700'
                                  : recipe.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-700'
                                  : 'bg-red-500/20 text-red-700'
                              }`}
                            >
                              {t.admin[recipe.status as keyof typeof t.admin]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              onClick={() => setSelectedRecipe(recipe.id)}
                              className="h-10 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              {t.admin.viewDetails}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {selectedRecipe && (
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">{t.admin.recipeDetails}</h3>
                  {recipes
                    .filter((r) => r.id === selectedRecipe)
                    .map((recipe) => (
                      <div key={recipe.id} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">{t.admin.patientName}</div>
                            <div className="text-base text-foreground font-medium">
                              {recipe.patientName}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">{t.admin.doctorName}</div>
                            <div className="text-base text-foreground font-medium">
                              {recipe.doctorName}
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-border pt-4">
                          <h4 className="text-lg font-semibold text-foreground mb-3">{t.admin.medications}</h4>
                          {recipe.medications.map((med, index) => (
                            <div key={index} className="p-4 bg-muted/30 rounded-lg mb-2">
                              <div className="font-medium text-foreground">{med.medicineName}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {t.admin.dosage}: {med.dosage} | {t.admin.frequency}: {med.frequency} | {t.admin.duration}:{' '}
                                {med.duration}
                              </div>
                            </div>
                          ))}
                        </div>

                        {recipe.vendingMachineId && (
                          <div className="border-t border-border pt-4">
                            <div className="text-sm text-muted-foreground">{t.admin.fulfilledAt}</div>
                            <div className="text-base text-foreground font-medium">
                              {
                                vendingMachineLocations.find((m) => m.id === recipe.vendingMachineId)
                                  ?.name
                              }{' '}
                              ({recipe.vendingMachineId})
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {recipe.fulfillmentDate &&
                                new Date(recipe.fulfillmentDate).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
