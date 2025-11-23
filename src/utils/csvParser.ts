export interface CSVPurchase {
  purchaseId: string;
  machineUid: string;
  machineName: string;
  region: string;
  city: string;
  date: string;
  itemIds: string[];
  itemCount: number;
  totalPrice: number;
  paymentStatus: 'completed' | 'refunded';
}

export async function loadPurchaseData(): Promise<CSVPurchase[]> {
  try {
    const response = await fetch('/fake-purchases-data.csv');
    const text = await response.text();
    const lines = text.split('\n');
    const purchases: CSVPurchase[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',');
      if (parts.length >= 10) {
        const itemIdsStr = parts[6];
        const itemIds = itemIdsStr.includes(';') ? itemIdsStr.split(';') : [itemIdsStr];

        purchases.push({
          purchaseId: parts[0],
          machineUid: parts[1],
          machineName: parts[2],
          region: parts[3],
          city: parts[4],
          date: parts[5],
          itemIds,
          itemCount: parseInt(parts[7]),
          totalPrice: parseFloat(parts[8]),
          paymentStatus: parts[9] === 'refunded' ? 'refunded' : 'completed',
        });
      }
    }

    return purchases;
  } catch (error) {
    console.error('Error loading purchase data:', error);
    return [];
  }
}

// Function to calculate stock based on purchase history
export function calculateStockFromPurchases(
  machineId: string,
  medicineId: string,
  purchases: CSVPurchase[],
  initialStock: number = 50
): number {
  const machinePurchases = purchases.filter((p) => p.machineUid === machineId);

  let totalSold = 0;
  for (const purchase of machinePurchases) {
    const count = purchase.itemIds.filter((id) => id === medicineId).length;
    totalSold += count;
  }

  return Math.max(0, initialStock - totalSold);
}
