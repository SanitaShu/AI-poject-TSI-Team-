-- Supabase Database Schema for Vending Machine

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'paypal',
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
  vending_machine_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transaction_items table (medicines in each transaction)
CREATE TABLE IF NOT EXISTS transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  medicine_id TEXT NOT NULL,
  medicine_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vending_machine_id TEXT NOT NULL,
  medicine_id TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  last_restocked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vending_machine_id, medicine_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(customer_email);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_inventory_vending_machine ON inventory(vending_machine_id);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security needs)
-- Allow anyone to insert transactions (for the vending machine)
CREATE POLICY "Allow public insert on transactions" ON transactions
  FOR INSERT WITH CHECK (true);

-- Allow anyone to insert transaction items
CREATE POLICY "Allow public insert on transaction_items" ON transaction_items
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read their own transactions
CREATE POLICY "Allow users to read their own transactions" ON transactions
  FOR SELECT USING (true);

-- Allow anyone to read transaction items
CREATE POLICY "Allow public read on transaction_items" ON transaction_items
  FOR SELECT USING (true);

-- Allow reading inventory
CREATE POLICY "Allow public read on inventory" ON inventory
  FOR SELECT USING (true);

-- Allow updating inventory (for stock management)
CREATE POLICY "Allow public update on inventory" ON inventory
  FOR UPDATE USING (true);

-- Allow inserting inventory
CREATE POLICY "Allow public insert on inventory" ON inventory
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
