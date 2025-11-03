import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, EditIcon, Trash2Icon, PackageIcon, TrendingUpIcon, SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModalPopup } from '../components/ModalPopup';
import { medicines } from '../data/medicines';

export function AdminPanelPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<string | null>(null);

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
                Admin Panel
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage inventory, products, and system settings
              </p>
            </div>

            <Button
              onClick={() => setShowAddModal(true)}
              className="h-14 px-8 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <PlusIcon className="w-5 h-5 mr-3" strokeWidth={2} />
              Add Product
            </Button>
          </div>

          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 h-14">
              <TabsTrigger value="inventory" className="text-base">
                <PackageIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="add" className="text-base">
                <PlusIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                Add Product
              </TabsTrigger>
              <TabsTrigger value="sales" className="text-base">
                <TrendingUpIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                Sales Log
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-base">
                <SettingsIcon className="w-5 h-5 mr-2" strokeWidth={2} />
                AI Setup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="space-y-4">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          Group
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          Stock
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-normal text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {medicines.slice(0, 10).map((medicine) => (
                        <tr key={medicine.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 text-sm text-foreground font-mono">
                            {medicine.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{medicine.name}</td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            Group {medicine.group}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            ${medicine.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">50</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setEditingMedicine(medicine.id)}
                                className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                <EditIcon className="w-4 h-4" strokeWidth={2} />
                              </Button>
                              <Button className="h-10 w-10 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                <Trash2Icon className="w-4 h-4" strokeWidth={2} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="add" className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  Add New Product
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-normal text-foreground mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-foreground mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-foreground mb-2">
                      Group
                    </label>
                    <select className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Group 1 - Pain Relief</option>
                      <option>Group 2 - Cold & Flu</option>
                      <option>Group 3 - Digestive Health</option>
                      <option>Group 4 - First Aid</option>
                      <option>Group 5 - Vitamins</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-foreground mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-normal text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter product description"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button className="flex-1 h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
                    Add Product
                  </Button>
                  <Button className="h-14 px-8 rounded-xl bg-muted text-muted-foreground hover:bg-muted/80">
                    Cancel
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <Card className="p-8">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  Recent Sales
                </h2>
                <p className="text-base text-muted-foreground">
                  Sales log functionality coming soon...
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  AI Configuration
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-normal text-foreground mb-2">
                      OpenAI API Key
                    </label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-foreground mb-2">
                      Model
                    </label>
                    <select className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>gpt-4</option>
                      <option>gpt-3.5-turbo</option>
                    </select>
                  </div>

                  <Button className="h-14 px-8 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
                    Test Connection
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ModalPopup
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <div className="space-y-4">
          <p className="text-base text-foreground">Product form will be displayed here...</p>
        </div>
      </ModalPopup>
    </div>
  );
}
