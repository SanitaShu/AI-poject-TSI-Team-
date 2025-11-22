import emailjs from '@emailjs/browser';

const ADMIN_EMAIL = 'touficjandah@gmail.com';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_CUSTOMER = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER;
const EMAILJS_TEMPLATE_ID_ADMIN = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export interface ReceiptData {
  transactionId: string;
  customerEmail: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  vendingMachineId: string;
}

/**
 * Generate HTML email template for customer receipt
 */
function generateReceiptHTML(data: ReceiptData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Purchase Receipt</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Thank You for Your Purchase!</h1>
      </div>

      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #667eea; margin-top: 0;">Receipt</h2>

        <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Vending Machine:</strong> ${data.vendingMachineId}</p>

        <table style="width: 100%; margin: 20px 0; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
              <th style="padding: 12px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr style="background: #f0f0f0; font-weight: bold;">
              <td colspan="3" style="padding: 15px; text-align: right;">Total:</td>
              <td style="padding: 15px; text-align: right; color: #667eea; font-size: 18px;">$${data.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 30px; padding: 20px; background: white; border-left: 4px solid #667eea; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            This is an automated receipt for your purchase. Please keep this email for your records.
            If you have any questions, please contact our support team.
          </p>
        </div>

        <div style="margin-top: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>Thank you for using our smart vending machine!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML email template for admin notification
 */
function generateAdminNotificationHTML(data: ReceiptData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Purchase Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2c3e50; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🛒 New Purchase Alert</h1>
      </div>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
        <p style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 0 0 20px 0;">
          A new purchase has been made from vending machine <strong>${data.vendingMachineId}</strong>
        </p>

        <h3 style="color: #2c3e50; margin-top: 0;">Purchase Details</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 5px 0;"><strong>Transaction ID:</strong> ${data.transactionId}</li>
          <li style="padding: 5px 0;"><strong>Customer Email:</strong> ${data.customerEmail}</li>
          <li style="padding: 5px 0;"><strong>Date:</strong> ${data.date}</li>
          <li style="padding: 5px 0;"><strong>Total Amount:</strong> $${data.total.toFixed(2)}</li>
        </ul>

        <h3 style="color: #2c3e50;">Items Purchased</h3>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #2c3e50; color: white;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
          <p style="margin: 0; color: #155724;">
            ✓ Payment received successfully via PayPal
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Initialize EmailJS (call this once when app loads)
 */
export function initEmailJS() {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
}

/**
 * Send email using EmailJS
 */
async function sendEmailViaEmailJS(
  templateId: string,
  templateParams: Record<string, any>
) {
  try {
    if (!EMAILJS_SERVICE_ID || !templateId || !EMAILJS_PUBLIC_KEY) {
      console.error('EmailJS is not configured. Please set environment variables.');
      return { success: false, error: 'EmailJS not configured' };
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending email via EmailJS:', error);
    return { success: false, error };
  }
}

/**
 * Send receipt email to customer
 */
export async function sendCustomerReceipt(data: ReceiptData) {
  const itemsList = data.items
    .map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const templateParams = {
    to_email: data.customerEmail,
    to_name: 'Customer',
    transaction_id: data.transactionId,
    date: data.date,
    vending_machine_id: data.vendingMachineId,
    items_list: itemsList,
    total: `$${data.total.toFixed(2)}`,
    receipt_html: generateReceiptHTML(data),
  };

  return sendEmailViaEmailJS(EMAILJS_TEMPLATE_ID_CUSTOMER, templateParams);
}

/**
 * Send purchase notification to admin
 */
export async function sendAdminNotification(data: ReceiptData) {
  const itemsList = data.items
    .map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  const templateParams = {
    to_email: ADMIN_EMAIL,
    to_name: 'Admin',
    customer_email: data.customerEmail,
    transaction_id: data.transactionId,
    date: data.date,
    vending_machine_id: data.vendingMachineId,
    items_list: itemsList,
    total: `$${data.total.toFixed(2)}`,
    notification_html: generateAdminNotificationHTML(data),
  };

  return sendEmailViaEmailJS(EMAILJS_TEMPLATE_ID_ADMIN, templateParams);
}

/**
 * Send both customer receipt and admin notification
 */
export async function sendPurchaseEmails(data: ReceiptData) {
  try {
    const [customerResult, adminResult] = await Promise.all([
      sendCustomerReceipt(data),
      sendAdminNotification(data),
    ]);

    return {
      success: customerResult.success && adminResult.success,
      customerEmail: customerResult,
      adminEmail: adminResult,
    };
  } catch (error) {
    console.error('Error sending purchase emails:', error);
    return { success: false, error };
  }
}
