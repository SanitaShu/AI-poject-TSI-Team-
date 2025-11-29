# EmailJS Setup Guide

## 📧 Email Integration with EmailJS

Your app now uses **EmailJS** to send emails directly from the frontend - no backend needed! This sends:
1. **Customer Receipt** → To the email entered at checkout
2. **Admin Notification** → To `touficjandah@gmail.com`

---

## 🚀 Step-by-Step Setup

### Step 1: Create EmailJS Account

1. Go to [https://emailjs.com](https://emailjs.com)
2. Click **Sign Up** (it's free!)
3. Verify your email address
4. Log in to your dashboard

---

### Step 2: Add Email Service

1. In EmailJS dashboard, click **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - Outlook
   - Yahoo
   - Or any SMTP service
4. Follow the connection steps for your provider
5. **Copy the Service ID** (looks like: `service_abc1234`)

---

### Step 3: Create Customer Receipt Template

1. Click **Email Templates** in the sidebar
2. Click **Create New Template**
3. **Template Name:** `Customer Receipt`
4. **Template ID:** Copy this (e.g., `template_xyz5678`)

5. **Subject:**
```
Purchase Receipt - {{transaction_id}}
```

6. **Content (HTML Editor):**

Click the **</>** icon to switch to HTML mode and paste:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0;">Thank You for Your Purchase!</h1>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #667eea;">Receipt</h2>

    <p><strong>Transaction ID:</strong> {{transaction_id}}</p>
    <p><strong>Date:</strong> {{date}}</p>
    <p><strong>Vending Machine:</strong> {{vending_machine_id}}</p>

    <h3 style="color: #667eea;">Items Purchased:</h3>
    <pre style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">{{items_list}}</pre>

    <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
      <p style="margin: 0; text-align: right; font-size: 24px; color: #667eea;">
        <strong>Total: {{total}}</strong>
      </p>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: white; border-left: 4px solid #667eea;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        This is your purchase receipt. Please keep this email for your records.
        If you have any questions, please contact our support team.
      </p>
    </div>

    <div style="margin-top: 20px; text-align: center; color: #999; font-size: 12px;">
      <p>Thank you for using our smart vending machine!</p>
    </div>
  </div>
</div>
```

7. **Variables Used:**
   - `{{to_email}}` - Customer email (auto-filled by EmailJS)
   - `{{transaction_id}}` - Transaction ID
   - `{{date}}` - Purchase date
   - `{{vending_machine_id}}` - Machine ID
   - `{{items_list}}` - List of items purchased
   - `{{total}}` - Total amount

8. Click **Save**

---

### Step 4: Create Admin Notification Template

1. Click **Create New Template** again
2. **Template Name:** `Admin Notification`
3. **Template ID:** Copy this (e.g., `template_abc9012`)

4. **Subject:**
```
New Purchase - {{vending_machine_id}} - {{total}}
```

5. **Content (HTML):**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2c3e50; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🛒 New Purchase Alert</h1>
  </div>

  <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
    <p style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px;">
      A new purchase has been made from vending machine <strong>{{vending_machine_id}}</strong>
    </p>

    <h3 style="color: #2c3e50;">Purchase Details</h3>
    <ul style="list-style: none; padding: 0;">
      <li style="padding: 5px 0;"><strong>Transaction ID:</strong> {{transaction_id}}</li>
      <li style="padding: 5px 0;"><strong>Customer Email:</strong> {{customer_email}}</li>
      <li style="padding: 5px 0;"><strong>Date:</strong> {{date}}</li>
      <li style="padding: 5px 0;"><strong>Total Amount:</strong> {{total}}</li>
    </ul>

    <h3 style="color: #2c3e50;">Items Purchased</h3>
    <pre style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2c3e50;">{{items_list}}</pre>

    <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
      <p style="margin: 0; color: #155724;">
        ✓ Payment received successfully via PayPal
      </p>
    </div>
  </div>
</div>
```

6. **Variables Used:**
   - `{{to_email}}` - Admin email (hardcoded to `touficjandah@gmail.com`)
   - `{{customer_email}}` - Customer's email
   - `{{transaction_id}}` - Transaction ID
   - `{{date}}` - Purchase date
   - `{{vending_machine_id}}` - Machine ID
   - `{{items_list}}` - Items purchased
   - `{{total}}` - Total amount

7. Click **Save**

---

### Step 5: Get Your Public Key

1. In EmailJS dashboard, click on your **Account**
2. Go to **API Keys** tab
3. Copy your **Public Key** (looks like: `abcDE12fGHijk-lmN`)

---

### Step 6: Update Your .env File

Open your `.env` file and update these values:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc1234        # From Step 2
VITE_EMAILJS_TEMPLATE_ID_CUSTOMER=template_xyz5678  # From Step 3
VITE_EMAILJS_TEMPLATE_ID_ADMIN=template_abc9012     # From Step 4
VITE_EMAILJS_PUBLIC_KEY=abcDE12fGHijk-lmN          # From Step 5
```

---

### Step 7: Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Testing the Email Flow

1. Open http://localhost:5173
2. Select some medicines
3. Go to checkout
4. Enter your test email (e.g., `poweroftaj@gmail.com`)
5. Complete PayPal payment (use sandbox)
6. Check both inboxes:
   - ✅ Customer email should receive receipt
   - ✅ `touficjandah@gmail.com` should receive notification

---

## 📊 EmailJS Free Tier Limits

- **200 emails/month** for free
- Perfect for testing and small-scale use
- Upgrade to paid plan for more emails if needed

---

## 🔧 Troubleshooting

### Emails Not Sending?

1. **Check Console Logs**
   - Open browser DevTools (F12)
   - Look for EmailJS errors in console

2. **Verify Configuration**
   - Service ID matches
   - Template IDs are correct
   - Public key is correct
   - No typos in .env file

3. **Check EmailJS Dashboard**
   - Go to **Logs** to see sent emails
   - Verify email service is connected
   - Check if templates are saved

4. **Email Provider Issues**
   - Gmail might require "Less secure app access"
   - Check your spam folder
   - Verify email service connection in EmailJS

### Environment Variables Not Loading?

1. Restart the dev server completely
2. Make sure `.env` file is in the root directory
3. Variable names must start with `VITE_`

---

## ✨ What Happens When Someone Buys?

1. **User completes payment** → PayPal payment successful
2. **Transaction saved** → Stored in Supabase database
3. **Customer receipt sent** → Beautiful HTML email to customer
4. **Admin notification sent** → Alert email to `touficjandah@gmail.com`
5. **Inventory updated** → Stock decremented in database

All automatic! 🎉

---

## 🎯 Next Steps

After setup:
1. Test with real email addresses
2. Customize email templates to match your branding
3. Monitor emails in EmailJS dashboard
4. Check Supabase for transaction data

---

## 📧 Email Addresses

- **Customer Receipt:** Sent to email entered at checkout
- **Admin Notification:** `touficjandah@gmail.com` (hardcoded)

To change admin email, edit line 3 in `src/services/email.ts`:
```typescript
const ADMIN_EMAIL = 'your-new-admin@email.com';
```

---

## 💡 Pro Tips

1. **Test with your own email first** to see how receipts look
2. **Check spam folders** if emails don't arrive
3. **Customize templates** in EmailJS dashboard anytime
4. **Monitor usage** in EmailJS dashboard to stay within limits
5. **Add your logo** to email templates for branding

---

Need help? Check the EmailJS documentation at https://www.emailjs.com/docs/
