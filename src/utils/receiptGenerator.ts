import { medicines } from '../data/medicines';

export interface ReceiptData {
  purchaseId: string;
  date: Date;
  machineId: string;
  machineName: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    pricePerUnit: number;
    total: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  paypalOrderId?: string;
  customerEmail: string;
}

/**
 * Generate a text-based receipt
 */
export function generateTextReceipt(data: ReceiptData): string {
  const lines: string[] = [];

  // Header
  lines.push('═══════════════════════════════════════');
  lines.push('       MEDICINE VENDING MACHINE       ');
  lines.push('              RECEIPT                 ');
  lines.push('═══════════════════════════════════════');
  lines.push('');

  // Machine info
  lines.push(`Machine: ${data.machineName} (${data.machineId})`);
  lines.push(`Date: ${data.date.toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'medium'
  })}`);
  lines.push(`Purchase ID: ${data.purchaseId}`);
  if (data.paypalOrderId) {
    lines.push(`PayPal Order: ${data.paypalOrderId}`);
  }
  lines.push('');

  lines.push('───────────────────────────────────────');
  lines.push('ITEMS PURCHASED');
  lines.push('───────────────────────────────────────');
  lines.push('');

  // Items
  data.items.forEach((item) => {
    lines.push(`${item.name}`);
    lines.push(`  Qty: ${item.quantity} × €${item.pricePerUnit.toFixed(2)} = €${item.total.toFixed(2)}`);
    lines.push('');
  });

  lines.push('───────────────────────────────────────');

  // Totals
  lines.push(`Subtotal (excl. VAT):    €${data.subtotal.toFixed(2)}`);
  lines.push(`VAT (12%):               €${data.vat.toFixed(2)}`);
  lines.push('');
  lines.push(`TOTAL PAID:              €${data.total.toFixed(2)}`);
  lines.push('');

  // Payment method
  lines.push(`Payment Method: ${data.paymentMethod.toUpperCase()}`);
  lines.push('');

  lines.push('═══════════════════════════════════════');
  lines.push('        IMPORTANT INFORMATION         ');
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push('• Keep this receipt for your records');
  lines.push('• Read package leaflets before use');
  lines.push('• Follow dosage instructions carefully');
  lines.push('• Consult a doctor if symptoms persist');
  lines.push('');
  lines.push('═══════════════════════════════════════');
  lines.push('      Thank you for your purchase!    ');
  lines.push('═══════════════════════════════════════');

  return lines.join('\n');
}

/**
 * Generate HTML receipt for email
 */
export function generateHTMLReceipt(data: ReceiptData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purchase Receipt</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 5px 0 0 0;
      opacity: 0.9;
      font-size: 14px;
    }
    .content {
      padding: 30px 20px;
    }
    .info-section {
      background-color: #f9fafb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    .info-value {
      color: #111827;
      font-weight: 600;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .items-table th {
      background-color: #f9fafb;
      padding: 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
      color: #374151;
    }
    .item-name {
      font-weight: 500;
      color: #111827;
    }
    .totals {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .total-row.final {
      font-size: 18px;
      font-weight: 700;
      color: #667eea;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-notes {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer-notes h4 {
      margin: 0 0 10px 0;
      color: #92400e;
      font-size: 14px;
      font-weight: 600;
    }
    .footer-notes ul {
      margin: 0;
      padding-left: 20px;
      color: #78350f;
      font-size: 13px;
    }
    .footer-notes li {
      margin-bottom: 5px;
    }
    .footer p {
      margin: 5px 0;
      color: #6b7280;
      font-size: 13px;
    }
    .badge {
      display: inline-block;
      background-color: #10b981;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💊 Purchase Receipt</h1>
      <p>Medicine Vending Machine</p>
    </div>

    <div class="content">
      <div class="info-section">
        <div class="info-row">
          <span class="info-label">Purchase ID:</span>
          <span class="info-value">${data.purchaseId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date:</span>
          <span class="info-value">${data.date.toLocaleString('en-GB', {
            dateStyle: 'long',
            timeStyle: 'short'
          })}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Machine:</span>
          <span class="info-value">${data.machineName} (${data.machineId})</span>
        </div>
        ${data.paypalOrderId ? `
        <div class="info-row">
          <span class="info-label">PayPal Order ID:</span>
          <span class="info-value">${data.paypalOrderId}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Payment Status:</span>
          <span class="info-value">Completed <span class="badge">✓ PAID</span></span>
        </div>
      </div>

      <h3 style="margin: 30px 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Items Purchased</h3>

      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td class="item-name">${item.name}</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">€${item.pricePerUnit.toFixed(2)}</td>
              <td style="text-align: right; font-weight: 600;">€${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal (excl. VAT):</span>
          <span>€${data.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>VAT (12%):</span>
          <span>€${data.vat.toFixed(2)}</span>
        </div>
        <div class="total-row final">
          <span>TOTAL PAID:</span>
          <span>€${data.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="footer-notes">
        <h4>⚠️ Important Information</h4>
        <ul>
          <li>Keep this receipt for your records</li>
          <li>Read package leaflets carefully before use</li>
          <li>Follow dosage instructions precisely</li>
          <li>Consult a doctor if symptoms persist or worsen</li>
          <li>Store medicines according to package instructions</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p><strong>Medicine Vending Machine Network</strong></p>
      <p>50 locations across Latvia</p>
      <p style="margin-top: 15px; color: #9ca3af; font-size: 12px;">
        This is an automated receipt. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Calculate VAT from total (assuming VAT is already included)
 * VAT rate: 12% in Latvia
 */
export function calculateVAT(totalWithVAT: number): { subtotal: number; vat: number } {
  const vatRate = 0.12;
  const subtotal = totalWithVAT / (1 + vatRate);
  const vat = totalWithVAT - subtotal;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    vat: Number(vat.toFixed(2)),
  };
}

/**
 * Create receipt data from purchase information
 */
export function createReceiptData(
  purchaseId: string,
  medicineIds: string[],
  paypalOrderId: string,
  customerEmail: string,
  machineId: string = 'VM-001',
  machineName: string = 'Default Location'
): ReceiptData {
  const items = medicineIds.map((id) => {
    const medicine = medicines.find((m) => m.id === id);
    if (!medicine) throw new Error(`Medicine not found: ${id}`);

    return {
      id: medicine.id,
      name: medicine.name,
      quantity: 1,
      pricePerUnit: medicine.priceWithVat,
      total: medicine.priceWithVat,
    };
  });

  const total = items.reduce((sum, item) => sum + item.total, 0);
  const { subtotal, vat } = calculateVAT(total);

  return {
    purchaseId,
    date: new Date(),
    machineId,
    machineName,
    items,
    subtotal,
    vat,
    total,
    paymentMethod: 'PayPal',
    paypalOrderId,
    customerEmail,
  };
}
