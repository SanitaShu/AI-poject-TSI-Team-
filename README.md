# AI-Driven OTC Medicine Vending Machines in Latvia
## Overview
Course: Data Analytics & AI
Project Duration: 13.10.2025 → 18.12.2025

## **Team Members**
**Sanita Šulca** – Product & Domain Lead  
**Vita Maurīte** – Data Engineer  
**Mostafa Salem** – Data Scientist  
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
## **Data Engineer – Data Sourcing, Cleaning & Preparation (Vita's Part)**
This describes the process of collecting, cleaning, and preparing datasets used for the analysis of OTC medicines, pharmacy distribution, and population statistics in Latvia. Data was obtained from official open data sources, including the State Agency of Medicines and the Central Statistical Bureau of Latvia. The resulting datasets form the foundation for further analysis and visualization in the team’s joint project.

Step 1: Licensed Pharmacies and 24/7 Availability
Data source: Open Data of the LPC Register – ZVA
   - 	Dataset includes all licensed pharmaceutical companies and pharmacies in Latvia.
   - 	Columns contain pharmacy name, address, license status, and geographic coordinates etc.
   - 	CSV file imported into Google Colab: /content/fdu_register.csv.
   - 	Unicode characters removed from headers.
   - 	24-hour pharmacies identified using the Pharmacy Map of Latvia https://dati.zva.gov.lv/aptieku-karte/?type_24h=1 
   - 	9 pharmacies were found to operate 24/7 in Latvia

**Observation:  Out of 818 total pharmacies, only 9 operate 24/7 — four in Riga and one in each of the other statistical regions.**

Step 2: Population Statistics by Region and Municipality
Data source: CSP – IRS031 https://data.stat.gov.lv/pxweb/en/OSP_PUB/START__POP__IR__IRS/IRS031/ 
   - Official demographic data by region, city, and municipality (2012–2025).
   - Missing values in the value column were removed.
Cleaned dataset saved as Population Statistics by Region and Municipality.csv.

**Use: to compare population distribution with pharmacy locations and regional accessibility.**

Step 3: Population by Age and Gender
Data source: CSP – IRD041 https://data.stat.gov.lv/pxweb/en/OSP_PUB/START__POP__IR__IRD/IRD041/ 
    -	Contains population counts by region, municipality, age group, gender, and year.
    -	Loaded and cleaned by removing rows with missing values.
Cleaned dataset saved as Population by Age Groups.csv.

**Use: Helps analyze demographic structure and connect age specific population data to OTC medicine demand. Medicine for adults and children.**

Step 4: Urban and Rural Population
Data source: CSP – IRD070 https://data.stat.gov.lv/pxweb/en/OSP_PUB/START__POP__IR__IRD/IRD070 
   - Annual data on Latvia’s urban and rural population (1935–2025).
   - Rows with missing value entries removed.
Cleaned dataset saved as Urban and Rural Population.csv.

**Use: Supports analysis of long-term urbanization trends and rural population accessibility to pharmacies and demand changes.**

Step 5: OTC Medicines Register
Data source: ZVA – List of All Medicines https://dati.zva.gov.lv/zalu-registrs/export/ 
   - Each product includes authorization numbers and package leaflet URLs
   - Authentic prices from Latvia State Agency of Medicines
   - XML register with 39,254 medicines registered in Latvia.
   - Filtered for legal_status = “bez receptes” (non-prescription).
   - Result: 2,494 OTC medicines, of which 2,099 belong to selected ATC categories (A, N, M, R, D).

Saved as otc_filtered_A_N_M_R_D_with_prices.csv
Cleaned dataset saved as otc_selection_150_popular.csv

Use: Choose 50 products, description for is_approved_for_kids “1” , 0 – no
Metadata https://dati.zva.gov.lv/zalu-registrs/faq/export “package_leaflet “ Link to how to use medication information (PDF, Word or other format)

**For this project 50 random medicines were selected and used otc_selection_50_balanced_v3.2.csv** 

Step 6: OTC Medicine Classification
Based on the Anatomical Therapeutic Chemical (ATC) classification system (https://www.who.int/tools/atc-ddd-toolkit/atc-classification).
The project focuses on five OTC therapeutic categories:

- A	ALIMENTARY TRACT AND METABOLISM
- N	NERVOUS SYSTEM
- M	MUSCULO-SKELETAL SYSTEM
- R	RESPIRATORY SYSTEM
- D	DERMATOLOGICALS

**Rationale: Consumers are not expected to understand ATC codes; categories must be intuitive and compliant with WHO guidelines.**

For the user interface of OTC vending machines, categories should be presented in clear, consumer-friendly language, not as ATC codes. Digestive / Oral care / Anti-inflammatory / Cold / Cough / Allergy / Dermatology / Antiseptic

Regulatory considerations on artificial intelligence for health https://www.who.int/publications/i/item/9789240078871 

This ensures that all analytical components, visualizations, and UI logic were based on accurate information essential for the OTC medicine and population accessibility 

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
