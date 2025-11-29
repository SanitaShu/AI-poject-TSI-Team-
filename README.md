# AI-Driven OTC Medicine Vending Machines in Latvia
## Overview
Course: Data Analytics & AI
Project Duration: 13.10.2025 → 18.12.2025

## **Team Members**
**Sanita Šulca** – Product & Domain Lead  
**Vita Maurīte** – Data Engineer  
**Mostafa Salem** – Data Scientist / Optimization Specialist  
**Toufic Jandah** – App & Chatbot Developer  
**Joanns Engels** – Monitoring & Visualization Engineer

## **🧭 Overview**

In many Latvian towns, there is limited access to **24/7 pharmacies**, which means people often cannot obtain essential **OTC (over-the-counter)** medicines during night hours or emergencies.  

This project develops an **AI-powered system** that:  
- **Optimizes** vending machine placement for OTC medicines  
- **Forecasts** demand and restocking needs (including expiry tracking)  
- **Provides** a safe chatbot for symptom-based consultation (*adults / kids*)  
- **Offers** a monitoring dashboard for inventory and predictive maintenance  

The goal is to improve **healthcare accessibility**, **reduce medicine waste**, and **ensure compliance** with Latvian regulations for OTC medicine sales.

## **💡 Key Features**

- 🗺️ **Placement Optimization:** Uses *Maximal Covering Location Problem* (MCLP) algorithms to determine where vending machines should be installed for maximum population coverage.  
- 📈 **Demand & Stock Forecasting:** Predicts usage and refill needs using time-series and regression models (ARIMA, XGBoost).  
- ⏱️ **Expiry & Stock Control:** Tracks expiry dates, automates FEFO (First-Expire, First-Out) logic, and enforces one-package-per-group purchase limits.  
- 🤖 **Chatbot Assistance:** A bilingual (Latvian/English) chatbot providing safe, non-diagnostic OTC guidance based on symptoms and age group (adults/kids).  
- 📊 **Monitoring Dashboard:** Real-time visualization of machine status, stock levels, expiry alerts, and predictive maintenance notifications.  
- ⚙️ **Data-Driven Management:** Implements the **Data-Driven Scrum (DDS)** framework to enable measurable progress and continuous improvement.

---

## **🚀 Development Status - Vending Machine Interface (Toufic's Part)**

### ✅ **Completed Features**

1. **Product Database** - **ALL 50 real OTC medicines** from Latvia
   - 5 categories with exactly **10 products each** (Digestive, Dermatology, Pain Relief, Cold/Allergy, Children & Special Care)
   - Complete pharmaceutical data (active ingredients, dosage, prices, storage)
   - Each product includes authorization numbers and package leaflet URLs
   - Authentic prices from Latvia State Agency of Medicines

2. **Inventory Management System**
   - 30 units per product per vending machine
   - Real-time stock tracking with persistence
   - Transaction history with PayPal order IDs
   - Purchase validation (checks stock before allowing purchases)
   - Automatic inventory deduction on successful payment

3. **PayPal Payment Integration** ✅
   - Secure checkout with PayPal SDK
   - Complete order summary before payment
   - Real-time payment processing
   - Transaction recording with order IDs
   - Error handling and user feedback
   - Support for PayPal, Credit/Debit Cards, and PayPal Credit

4. **Smart Selection System** ✅
   - **One medicine per category rule** enforced
   - Maximum 5 items (one from each category)
   - Automatic replacement if selecting different medicine from same category
   - Visual indicators showing selected categories
   - Out-of-stock prevention

5. **Modern UI/UX**
   - Responsive design with Tailwind CSS
   - Smooth animations with Framer Motion
   - Mobile-friendly interface
   - Professional healthcare-focused design
   - Real-time cart updates

6. **State Management**
   - Zustand with localStorage persistence
   - Shopping cart functionality
   - Admin panel foundation
   - Persistent inventory across sessions

### 🚧 **Next Steps** (See `IMPLEMENTATION_GUIDE.md`)

1. **OpenAI AI Assistant Integration** (Pending)
   - Symptom-based medicine recommendations
   - Conversational health guidance
   - Safety warnings and doctor referral logic
   - **Instructions available in IMPLEMENTATION_GUIDE.md**

2. **Enhanced Age Verification** (Pending)
   - Webcam-based ID capture
   - Support for: Passport, ID Card, Residence Permit
   - OCR verification (future)
   - **Instructions available in IMPLEMENTATION_GUIDE.md**

3. **Admin Panel Enhancement** (Pending)
   - Inventory management interface
   - Low stock alerts
   - Transaction monitoring
   - Restock functionality
   - **Instructions available in IMPLEMENTATION_GUIDE.md**

### **📖 Quick Start**

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:5173
```

### **🔧 PayPal Setup (Required for Payment)**

```bash
# PayPal SDK is already installed
# Just configure your .env file:

# Get your PayPal Client ID from: https://developer.paypal.com/dashboard/
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_PAYPAL_MODE=sandbox  # or 'live' for production
```

**To test PayPal in sandbox mode:**
1. Create a developer account at https://developer.paypal.com/
2. Go to Dashboard → Apps & Credentials → Create App
3. Copy the **Client ID** from the sandbox section
4. Paste it into `.env` as `VITE_PAYPAL_CLIENT_ID`
5. Use sandbox test accounts to test payments

### **💡 AI Assistant Setup (Optional)**

```bash
# Install OpenAI SDK
npm install openai@^4.20.1

# Configure .env file
VITE_OPENAI_API_KEY=your_openai_key
```

**Detailed guide**: See `IMPLEMENTATION_GUIDE.md` for complete AI integration instructions.

### **📊 Medicine Database**

- **Total Products**: **50 authentic OTC medicines** ✅
- **Categories**: 5 (10 products each)
- **Price Range**: €1.30 - €29.95 (VAT included)
- **Data Source**: Latvia State Agency of Medicines
- **Stock per Machine**: 30 units per product
- **Selection Rule**: **One medicine per category** (max 5 total)

### **🛠️ Tech Stack**

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Framer Motion
- Zustand (state management with persistence)
- React Router v7
- Radix UI components
- OpenAI GPT-4 (planned)
- PayPal SDK (planned)

---
