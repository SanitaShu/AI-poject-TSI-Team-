import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface TransactionData {
  transactionId: string;
  customerEmail: string;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  vendingMachineId: string;
  items: {
    medicineId: string;
    medicineName: string;
    quantity: number;
    price: number;
  }[];
}

export interface InventoryUpdate {
  vendingMachineId: string;
  medicineId: string;
  stock: number;
}

/**
 * Save a transaction to the database
 */
export async function saveTransaction(data: TransactionData) {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase not configured - transaction not saved to database');
    return { success: true, transaction: null, warning: 'Database disabled' };
  }

  try {
    // Insert transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        transaction_id: data.transactionId,
        customer_email: data.customerEmail,
        total: data.total,
        payment_method: data.paymentMethod,
        status: data.status,
        vending_machine_id: data.vendingMachineId,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error saving transaction:', transactionError);
      throw transactionError;
    }

    // Insert transaction items
    const items = data.items.map((item) => ({
      transaction_id: transaction.id,
      medicine_id: item.medicineId,
      medicine_name: item.medicineName,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('transaction_items')
      .insert(items);

    if (itemsError) {
      console.error('Error saving transaction items:', itemsError);
      throw itemsError;
    }

    return { success: true, transaction };
  } catch (error) {
    console.error('Error in saveTransaction:', error);
    return { success: false, error };
  }
}

/**
 * Update inventory stock in the database
 */
export async function updateInventory(updates: InventoryUpdate[]) {
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase not configured - inventory not updated in database');
    return { success: true, warning: 'Database disabled' };
  }

  try {
    const promises = updates.map(async (update) => {
      // Check if inventory item exists
      const { data: existing } = await supabase
        .from('inventory')
        .select('*')
        .eq('vending_machine_id', update.vendingMachineId)
        .eq('medicine_id', update.medicineId)
        .single();

      if (existing) {
        // Update existing inventory
        return supabase
          .from('inventory')
          .update({
            stock: update.stock,
            last_restocked: new Date().toISOString(),
          })
          .eq('vending_machine_id', update.vendingMachineId)
          .eq('medicine_id', update.medicineId);
      } else {
        // Insert new inventory item
        return supabase.from('inventory').insert({
          vending_machine_id: update.vendingMachineId,
          medicine_id: update.medicineId,
          stock: update.stock,
          last_restocked: new Date().toISOString(),
        });
      }
    });

    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error('Error updating inventory:', error);
    return { success: false, error };
  }
}

/**
 * Sync local inventory with database
 */
export async function syncInventory(vendingMachineId: string, inventory: any[]) {
  const updates = inventory.map((item) => ({
    vendingMachineId,
    medicineId: item.medicineId,
    stock: item.stock,
  }));

  return updateInventory(updates);
}

/**
 * Get all transactions for a vending machine
 */
export async function getTransactions(vendingMachineId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        transaction_items (*)
      `)
      .eq('vending_machine_id', vendingMachineId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, transactions: data };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return { success: false, error };
  }
}

/**
 * Get inventory for a vending machine
 */
export async function getInventory(vendingMachineId: string) {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('vending_machine_id', vendingMachineId);

    if (error) throw error;

    return { success: true, inventory: data };
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return { success: false, error };
  }
}
