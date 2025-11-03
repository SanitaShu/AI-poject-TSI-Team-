# AI-Driven Optimization of OTC Medicine Vending Machines in Latvia
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

1. **Product Database** - 40 real OTC medicines from Latvia
   - 5 categories (Digestive, Dermatology, Pain Relief, Cold/Allergy, Vitamins)
   - Complete pharmaceutical data (active ingredients, dosage, prices, storage)
   - Each product includes authorization numbers and package leaflet URLs

2. **Inventory Management System**
   - 30 units per product per vending machine
   - Real-time stock tracking with persistence
   - Transaction history
   - Purchase validation (checks stock before allowing purchases)

3. **Modern UI/UX**
   - Responsive design with Tailwind CSS
   - Smooth animations with Framer Motion
   - Mobile-friendly interface
   - Professional healthcare-focused design

4. **State Management**
   - Zustand with localStorage persistence
   - Shopping cart functionality
   - Admin panel foundation

### 🚧 **Next Steps** (See `IMPLEMENTATION_GUIDE.md`)

1. **OpenAI AI Assistant Integration**
   - Symptom-based medicine recommendations
   - Conversational health guidance
   - Safety warnings and doctor referral logic

2. **PayPal Payment Integration**
   - Secure checkout flow
   - Transaction recording
   - Payment verification

3. **Enhanced Age Verification**
   - Webcam-based ID capture
   - Support for: Passport, ID Card, Residence Permit
   - OCR verification (future)

4. **Admin Panel Enhancement**
   - Inventory management interface
   - Low stock alerts
   - Transaction monitoring
   - Restock functionality

### **📖 Quick Start**

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:5173
```

### **🔧 Full Setup with AI & Payment**

```bash
# Install OpenAI and PayPal SDKs
npm install openai@^4.20.1 @paypal/react-paypal-js

# Configure .env file
VITE_OPENAI_API_KEY=your_key_here
VITE_PAYPAL_CLIENT_ID=your_paypal_id
```

**Detailed guide**: See `IMPLEMENTATION_GUIDE.md` for complete setup instructions.

### **📊 Medicine Database**

- **Total Products**: 40 authentic OTC medicines
- **Categories**: 5 (8 products each)
- **Price Range**: €1.30 - €29.95 (VAT included)
- **Data Source**: Latvia State Agency of Medicines
- **Stock per Machine**: 30 units per product

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
