# Smart Medicine Vending Machine - Implementation Guide

## Overview
This is a complete smart vending machine system with 40 real OTC medicines from Latvia, organized into 5 categories. Each vending machine holds 30 units of each product.

## What Has Been Implemented

### ✅ 1. Product Database (40 Real Medicines)
- **Location**: `src/data/medicines.ts`
- **Categories** (8 products per category):
  1. **Digestive / Oral Care** - Digestive enzymes, anti-diarrhea, laxatives, antacids
  2. **Dermatology / Antiseptic** - Antiviral creams, antifungals, antiseptics, wound care
  3. **Anti-inflammatory / Pain Relief** - Ibuprofen, Paracetamol, Aspirin (adult & children's formulas)
  4. **Cold / Cough / Allergy** - Antihistamines, decongestants, cough medicine
  5. **Vitamins & Supplements** - Prenatal vitamins (Elevit Pronatal included)

### ✅ 2. Inventory Management System
- **Location**: `src/stores/appStore.ts`
- Each medicine starts with 30 units
- Real-time stock tracking
- Persistent storage (data survives page refresh)
- Purchase validation (checks stock before allowing purchase)
- Transaction history

### ✅ 3. State Management with Zustand
- Inventory tracking per vending machine
- Transaction history
- Age verification status
- Admin authentication
- Shopping cart management
- Persistence using localStorage

## What Needs to Be Implemented

### 🔧 1. Install Additional Dependencies

```bash
npm install openai@^4.20.1 @paypal/react-paypal-js
```

### 🔧 2. Configure Environment Variables

Edit the `.env` file in the project root:

```env
# Get your OpenAI API key from: https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=sk-proj-xxxxx

# Get PayPal credentials from: https://developer.paypal.com/dashboard/
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_PAYPAL_MODE=sandbox  # Change to 'live' for production

VITE_VENDING_MACHINE_ID=VM-001
VITE_DEFAULT_STOCK_QUANTITY=30
```

### 🔧 3. OpenAI Integration for AI Assistant

**Purpose**: The AI will recommend medicines based on user symptoms.

**Training the AI**: You don't need to manually "train" it. Instead, provide context through the system prompt. The AI will use:
- Your complete medicine database
- Medicine descriptions, active ingredients, and uses
- Symptom-to-medication mapping

**Implementation** (create `src/services/openaiService.ts`):

```typescript
import OpenAI from 'openai';
import { medicines, medicineGroups } from '../data/medicines';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for demo - use backend in production
});

export async function getOTC_Recommendations(symptoms: string): Promise<string[]> {
  const medicineContext = medicines.map(med =>
    `ID: ${med.id}, Name: ${med.name}, Use: ${med.description}, Category: ${medicineGroups.find(g => g.id === med.group)?.name}, Active: ${med.activeSubstance}`
  ).join('\\n');

  const systemPrompt = `You are a knowledgeable pharmacist assistant for an OTC medicine vending machine.

Available medicines:\\n${medicineContext}

IMPORTANT RULES:
- Only recommend over-the-counter (OTC) medicines from the available list
- Return ONLY medicine IDs as a JSON array, e.g., ["med-001", "med-021"]
- Recommend 2-4 medicines maximum
- For serious conditions, advise seeing a doctor
- Never recommend prescription medicines
- Consider drug interactions and contraindications

Example response format: ["med-021", "med-026"]`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `I have these symptoms: ${symptoms}. What OTC medicines should I consider?` }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = response.choices[0].message.content || '[]';

  try {
    const medicineIds = JSON.parse(content);
    return Array.isArray(medicineIds) ? medicineIds : [];
  } catch {
    // Parse medicine IDs from text if JSON parsing fails
    const ids = content.match(/med-\\d{3}/g) || [];
    return ids.slice(0, 4);
  }
}

// Conversational AI for the chat interface
export async function chatWithAssistant(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const medicineContext = medicines.map(med =>
    `${med.name}: ${med.description}`
  ).join('\\n');

  const systemPrompt = `You are a friendly, empathetic pharmacist assistant.

Available OTC medicines:\\n${medicineContext}

Guidelines:
- Ask clarifying questions about symptoms
- Provide health advice for common ailments
- Recommend appropriate OTC medicines
- Warn when doctor consultation is needed
- Be warm and supportive
- Keep responses concise (2-3 sentences)`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  return response.choices[0].message.content || 'I apologize, I could not process that. Could you rephrase?';
}
```

### 🔧 4. Update ChatRecommendationPage to Use OpenAI

**File**: `src/pages/ChatRecommendationPage.tsx`

Add this code to handle OpenAI chat:

```typescript
import { chatWithAssistant, getOTC_Recommendations } from '../services/openaiService';

// In your component:
const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
  { role: 'assistant', content: 'Hello! I\'m your AI health assistant. What symptoms are you experiencing today?' }
]);
const [isLoading, setIsLoading] = useState(false);

const handleSendMessage = async (userMessage: string) => {
  setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
  setIsLoading(true);

  try {
    const response = await chatWithAssistant([
      ...messages,
      { role: 'user', content: userMessage }
    ]);

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);

    // If user confirms symptoms, get recommendations
    if (userMessage.toLowerCase().includes('recommend') ||
        userMessage.toLowerCase().includes('suggest')) {
      const recommendations = await getOTC_Recommendations(userMessage);
      addRecommendedMedicines(recommendations);
    }
  } catch (error) {
    console.error('AI Error:', error);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'I apologize, I\'m having trouble connecting. Please try again.'
    }]);
  } finally {
    setIsLoading(false);
  }
};
```

### 🔧 5. PayPal Integration

**Create**: `src/components/PayPalButton.tsx`

```typescript
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useAppStore } from '../stores/appStore';
import { medicines } from '../data/medicines';

interface PayPalButtonProps {
  onSuccess: () => void;
  onError: () => void;
}

export function PayPalButton({ onSuccess, onError }: PayPalButtonProps) {
  const { selectedMedicines, processPurchase, addTransaction } = useAppStore();

  const total = selectedMedicines.reduce((sum, id) => {
    const medicine = medicines.find(m => m.id === id);
    return sum + (medicine?.priceWithVat || 0);
  }, 0);

  return (
    <PayPalScriptProvider
      options={{
        'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: 'EUR',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total.toFixed(2),
                  currency_code: 'EUR',
                },
                description: 'OTC Medicine Purchase',
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const order = await actions.order?.capture();

          if (order?.status === 'COMPLETED') {
            const success = processPurchase(selectedMedicines);

            if (success) {
              // Record transaction
              addTransaction({
                id: order.id,
                date: new Date(),
                medicines: selectedMedicines.map(id => {
                  const med = medicines.find(m => m.id === id)!;
                  return {
                    id: med.id,
                    name: med.name,
                    quantity: 1,
                    price: med.priceWithVat,
                  };
                }),
                total,
                paymentMethod: 'paypal',
                status: 'completed',
              });
              onSuccess();
            } else {
              onError();
            }
          }
        }}
        onError={(err) => {
          console.error('PayPal Error:', err);
          onError();
        }}
      />
    </PayPalScriptProvider>
  );
}
```

### 🔧 6. Enhanced Age Verification with ID Upload

**Update**: `src/pages/VerifyAgePage.tsx`

Add ID document upload feature:

```typescript
import Webcam from 'react-webcam';
import { useState, useRef } from 'react';

const [selectedIDType, setSelectedIDType] = useState<'passport' | 'residence_permit' | 'id_card' | null>(null);
const [capturedImage, setCapturedImage] = useState<string | null>(null);
const webcamRef = useRef<Webcam>(null);

const captureIDDocument = () => {
  const imageSrc = webcamRef.current?.getScreenshot();
  if (imageSrc) {
    setCapturedImage(imageSrc);
  }
};

const verifyDocument = async () => {
  if (!capturedImage || !selectedIDType) return;

  // In production, send to backend for OCR verification
  // For now, just simulate verification
  setVerificationMethod(selectedIDType);
  setAgeVerified(true);
  navigate('/ai-assistant');
};

// Render:
<div>
  <h3>Select ID Type</h3>
  <button onClick={() => setSelectedIDType('passport')}>Passport</button>
  <button onClick={() => setSelectedIDType('id_card')}>ID Card</button>
  <button onClick={() => setSelectedIDType('residence_permit')}>Residence Permit</button>

  {selectedIDType && (
    <>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <button onClick={captureIDDocument}>Capture Document</button>
    </>
  )}

  {capturedImage && (
    <>
      <img src={capturedImage} alt="Captured ID" />
      <button onClick={verifyDocument}>Verify & Continue</button>
    </>
  )}
</div>
```

### 🔧 7. Admin Panel with Inventory Management

**Update**: `src/pages/AdminPanelPage.tsx`

```typescript
import { useAppStore } from '../stores/appStore';
import { medicines } from '../data/medicines';

export function AdminPanelPage() {
  const { inventory, transactions, restockProduct, vendingMachineId } = useAppStore();

  return (
    <div className="container mx-auto px-8 py-12">
      <h1>Admin Panel - {vendingMachineId}</h1>

      <section>
        <h2>Inventory Management</h2>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Price (VAT incl.)</th>
              <th>Last Restocked</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              const medicine = medicines.find(m => m.id === item.medicineId);
              return (
                <tr key={item.medicineId}>
                  <td>{medicine?.productId}</td>
                  <td>{medicine?.name}</td>
                  <td>{medicine?.group}</td>
                  <td className={item.stock < 5 ? 'text-red-600 font-bold' : ''}>
                    {item.stock} units
                  </td>
                  <td>€{medicine?.priceWithVat.toFixed(2)}</td>
                  <td>{new Date(item.lastRestocked).toLocaleString()}</td>
                  <td>
                    <button onClick={() => restockProduct(item.medicineId, 30)}>
                      Restock to 30
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Transaction History</h2>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{new Date(tx.date).toLocaleString()}</td>
                <td>{tx.medicines.length} items</td>
                <td>€{tx.total.toFixed(2)}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
```

### 🔧 8. Initialize Inventory on App Load

**Update**: `src/App.tsx`

```typescript
import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';

function AppContent() {
  const navigate = useNavigate();
  const { initializeInventory } = useAppStore();

  useEffect(() => {
    // Initialize inventory with 30 units each on first load
    initializeInventory();
  }, [initializeInventory]);

  useIdleTimer(() => {
    navigate('/');
  }, 30000);

  return <AppRouter />;
}
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install openai@^4.20.1 @paypal/react-paypal-js
   ```

2. **Configure environment variables** in `.env`:
   - Get OpenAI API key from https://platform.openai.com/api-keys
   - Get PayPal sandbox credentials from https://developer.paypal.com/

3. **Implement the services and components** listed above

4. **Test the system**:
   - Age verification with ID capture
   - AI assistant recommendations
   - Product selection from 40 medicines
   - PayPal payment flow
   - Inventory deduction
   - Admin panel viewing

## Security Notes (Production)

⚠️ **IMPORTANT**: For production deployment:

1. **Never expose API keys in frontend** - Move OpenAI calls to a backend API
2. **Implement real ID verification** - Use OCR services like AWS Textract or Google Cloud Vision
3. **Secure admin panel** - Add proper authentication (JWT, OAuth)
4. **PayPal webhook** - Implement server-side payment verification
5. **Rate limiting** - Prevent API abuse
6. **HTTPS only** - Encrypt all communications

## Medicine Categories Summary

- **Total Products**: 40
- **Products per Category**: 8
- **Initial Stock per Product**: 30 units
- **Categories**: Digestive, Dermatology, Pain Relief, Cold/Allergy, Vitamins
- **Price Range**: €1.30 - €29.95
- **All products**: Real OTC medicines with authentic data from Latvia's medicine registry

## Support

For issues or questions:
1. Check the console for errors
2. Verify environment variables are set
3. Ensure APIs have valid credentials
4. Check network requests in browser DevTools
