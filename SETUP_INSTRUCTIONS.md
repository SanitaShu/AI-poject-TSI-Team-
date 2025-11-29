# Purchase Flow Setup Instructions

## Overview
I've implemented the complete purchase flow with database storage and email notifications. Here's what was added:

### ✅ What's Implemented:
1. **Database Integration** - Saves all transactions to Supabase
2. **Email Receipts** - Sends receipt to customer email
3. **Admin Notifications** - Sends purchase alerts to `touficjandah@gmail.com`
4. **Required Email Field** - Users must provide email before payment
5. **Inventory Tracking** - Updates stock in database

---

## 🚀 Setup Steps

### Step 1: Set Up Supabase Database

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `jpuaikcpyfnimgjdsauq`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `supabase-schema.sql` and paste it into the SQL editor
6. Click **Run** to create all the tables

This will create:
- `transactions` table - Stores all purchases
- `transaction_items` table - Stores individual items in each purchase
- `inventory` table - Tracks stock levels

### Step 2: Set Up Email Service (Supabase Edge Function)

You have two options for sending emails:

#### Option A: Supabase Edge Functions (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Create an edge function:
```bash
cd C:\Users\Toufi\AndroidStudioProjects\AI-poject-TSI-Team-ftuh
supabase functions new send-email
```

3. Copy this code into `supabase/functions/send-email/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Vending Machine <noreply@yourdomain.com>',
        to: [to],
        subject,
        html,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

4. Deploy the function:
```bash
supabase functions deploy send-email --project-ref jpuaikcpyfnimgjdsauq
```

5. Set the Resend API key as a secret:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key --project-ref jpuaikcpyfnimgjdsauq
```

6. Get Resend API Key:
   - Sign up at https://resend.com
   - Go to API Keys
   - Create a new key
   - Add your domain or use their test domain

#### Option B: External Email Service API

If you prefer to use a separate backend service:

1. Create a simple email API endpoint at `/api/send-email`
2. Update `.env` with your email service URL:
```
VITE_EMAIL_SERVICE_URL=https://your-backend.com/api/send-email
```

The service should accept POST requests with:
```json
{
  "to": "customer@email.com",
  "subject": "Receipt",
  "html": "<html>..."
}
```

### Step 3: Verify Environment Variables

Make sure your `.env` file has all these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jpuaikcpyfnimgjdsauq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_PROJECT_REF=jpuaikcpyfnimgjdsauq
SUPABASE_ACCESS_TOKEN=sbp_627900baaac6dc596dca7cbdc34cb01c04781719

# Vending Machine
VITE_VENDING_MACHINE_ID=VM-001

# Email Service (Optional - only if using external service)
VITE_EMAIL_SERVICE_URL=https://your-email-service.com/send
```

### Step 4: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Go through the purchase flow:
   - Select medicines
   - Go to checkout
   - Enter a valid email (e.g., `poweroftaj@gmail.com`)
   - Complete PayPal payment (use sandbox)

3. Check that:
   - ✅ Transaction is saved to Supabase (check in Supabase Dashboard > Table Editor)
   - ✅ Customer receives receipt email
   - ✅ Admin (`touficjandah@gmail.com`) receives notification email
   - ✅ Inventory is updated

---

## 📋 How It Works

### Purchase Flow:

1. **User enters email** (required field with validation)
2. **User completes PayPal payment**
3. **On payment success:**
   - Transaction is saved to Supabase database
   - Customer email is sent with detailed receipt
   - Admin email is sent with purchase notification
   - Inventory is updated (decremented)
   - Local store is updated

### Email Templates:

**Customer Receipt:**
- Beautiful HTML template with purchase details
- Transaction ID
- Itemized list of medicines
- Total amount
- Vending machine ID

**Admin Notification:**
- Purchase alert with key details
- Customer email
- Transaction ID
- Items purchased
- Total amount
- Machine ID

---

## 🛠️ Files Created/Modified

### New Files:
- `supabase-schema.sql` - Database schema
- `src/services/database.ts` - Database operations
- `src/services/email.ts` - Email sending logic
- `SETUP_INSTRUCTIONS.md` - This file

### Modified Files:
- `src/pages/CheckoutPage.tsx` - Integrated database and email
- `.mcp.json` - Fixed MCP configuration

---

## 🔧 Troubleshooting

### Emails Not Sending:
1. Check Supabase Edge Function logs
2. Verify Resend API key is set
3. Check console for error messages
4. Verify email service is working

### Database Errors:
1. Make sure you ran the SQL schema
2. Check Supabase dashboard for errors
3. Verify RLS policies are correct
4. Check console for detailed error messages

### MCP Not Working:
1. Run `claude mcp list` to verify connection
2. Check `.mcp.json` has correct credentials
3. Restart Claude Code

---

## 📧 Email Addresses

- **Customer Receipt:** Sent to email entered at checkout
- **Admin Notification:** `touficjandah@gmail.com` (hardcoded in `src/services/email.ts:3`)

To change admin email, edit `ADMIN_EMAIL` in `src/services/email.ts`

---

## 🎯 Next Steps

1. Set up Supabase database (run SQL schema)
2. Choose and configure email service
3. Test the complete flow
4. Monitor transactions in Supabase dashboard
5. Check admin email for notifications

---

## 💡 Additional Features You Can Add

- Email templates customization
- SMS notifications
- Receipt PDF generation
- Transaction history page
- Inventory low-stock alerts
- Admin dashboard for viewing all transactions

---

Need help? Check the console logs for detailed error messages!
