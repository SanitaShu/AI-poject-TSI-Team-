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

## **🔗 Final Product Links**

- **🌐 Live Demo:** [https://sanitashu.github.io/AI-poject-TSI-Team-/](https://sanitashu.github.io/AI-poject-TSI-Team-/)
- **📦 GitHub Repository:** [https://github.com/SanitaShu/AI-poject-TSI-Team-](https://github.com/SanitaShu/AI-poject-TSI-Team-)
- **📊 Power BI Dashboard:** [Machine Analysis Dashboard](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Machine%20Analysis.pbix)
- **📋 Kanban Board:** [Project Management Board](https://github.com/users/SanitaShu/projects/2/views/2)

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
## Product Owner & Domain Lead (Legal, Ethics & Coordination) (Sanita’s part)  

---

### Overview

The initial project idea was developed into a structured research prototype. The project scope was defined to ensure feasibility within time constraints, legal limitations, and academic requirements. Legal and ethical considerations, such as user safety, data protection, informed consent, and responsible medicine use, were integrated into the system design through purchase limits, age-appropriate medicine separation (adults/kids), safety warnings, and GDPR-compliant consent mechanisms. Team coordination and system testing supported alignment across development stages, ensuring that the final outcome was realistic, ethically responsible, and suitable for a real-world healthcare context.


### Note

This project is a **research prototype and simulation only**.  
No real vending machines, medicine sales, or personal data processing are performed.


### Key Contributions

#### Project Ideation & Scope Definition
- Proposed the initial project idea addressing limited access to OTC medicines in Latvia  
- Defined project objectives, scope, constraints, and success criteria  
- Identified in-scope and out-of-scope features  
- Project proposal - https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/AI%20Project%20proposal%20.pdf
- Project charter- https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Project-Charter-.pdf


#### Leal, Compliance & Ethical Analysis
- Researched Latvian pharmaceutical law, OTC distribution rules, advertising regulations, and GDPR  
- Defined ethical safeguards:
  - purchase limits (1 package per category per 24h)
  - separation of adult and child medicines
  - safety warnings and disclaimers
- Designed consent-based facial recognition logic with 24-hour data retention
- Face recognition consent - https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/FACE%20RECOGNITION%20CONSENT.pdf 
- Legal, Etics and Compliance and legal path- https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/LEGAL_ETHICAL_AND_COMPLIANCE_ASSESSMENT_AND_LEGAL%20PATH.pdf


#### Project Management & Coordination
- Assigned team roles and supported task breakdown  
- Organised and participated in project meetings  
- Coordinated communication and priorities across the team  
-  **Kanban Board (Data-Driven Scrum):**  
- Kanban board- https://github.com/users/SanitaShu/projects/2/views/2
- Meeting minutes - https://github.com/SanitaShu/AI-poject-TSI-Team-/tree/main/Meeting%20minutes%20PDF

#### Risk Management
- Created and maintained the project risk register  
- Focused on legal, ethical, data protection, and delivery risks  
- Risk register - https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Risk%20REGISTER.pdf

#### Testing & Validation
- Acted as the main tester of the app and chatbot  
- Tested user flows, safety rules, consent logic, and ethical safeguards  
- Test report - https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/test1.pdf

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

### **📦 Final Deliverables**
- **Cleaned Datasets:**
  - [OTC Medicines (50 products)](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/otc_selection_50_balanced_v3.2.csv)
  - [Population Analysis](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Population%20Analysis.csv)
  - [Machine Distribution](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Machine%20Distribution.csv)
  - [Fake Purchase Data (Testing)](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/FINAL_fake_purchase_data_with_machineID.xlsx)

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

### **📦 Final Deliverables**
- **🌐 Live Vending Machine App:** [https://sanitashu.github.io/AI-poject-TSI-Team-/](https://sanitashu.github.io/AI-poject-TSI-Team-/)
- **📂 Source Code:** [GitHub Repository](https://github.com/SanitaShu/AI-poject-TSI-Team-)
- **📖 Documentation:**
  - [Implementation Guide](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/IMPLEMENTATION_GUIDE.md)
  - [Setup Instructions](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/SETUP_INSTRUCTIONS.md)
  - [EmailJS Setup](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/EMAILJS_SETUP_GUIDE.md)

---
# Data Scientist – Demand Modeling, Optimization & Placement Analysis (Mostafa’s Part)
This part discusses the construction of data-centric models and optimization method used to estimate OTC medicine usage, evaluate demographic trends, and establish the optimal allocation of vending machines across municipalities in Latvia. The analysis has been built based on the cleaned dataset by the data engineering workflow and converts them into indicators for strategic strategies and dashboard visualization.

## Step 1: Population Trend Analysis
The official population statistics was used by municipality (2012-2024), areas of population growth which are long demographic trends were analyzed to identify the growth and declination of population. Population growth rate for each municipality was calculated to understand population trend rather than short-term variation.
This step was important to recognize:
	Suburban growing municipalities.
	Declination of rural regions.
	Stable urban centers.
Usage of growth trend as proxy to guide through vending machine placements.
For each municipality m, Growth Rate is calculated as:
〖GrowthRate〗_m  =  (P_(m,2024)-P_(m,2012))/P_(m,2012) 
Where:
P_(m,2024) = population in 2024
P_(m,2012) = population in 2012

## Step 2: Demand Score Modeling
Demographic data was converted to meaningful insights by using demand score which developed by merging population size in 2024 with population growth.
〖DemandScore〗_m  = P_(m,2024)  x ( 1+ 〖GrowthRate〗_m)

The demand score ensures that municipalities with growth rate and high population get higher concern and priority, while regions with decline in population and negative growth rate are proportionately getting lower weighting and with this technique comparison will reliable between municipalities with different demographic statistics and different sizes.
〖StandardizedDemand 〗_m=  〖DemandScore〗_m/(∑_(i=1)^N▒〖DemandScore〗_i )

## Step 3: Machine Allocation Optimization
To allocate 50 vending machines across municipalities, optimization approach must be constrained. Machine counts were distributed based on standardized demand score, and this method approximates the optimization problem to align with Maximal Covering Location Problem (MCLP) principles to ensure:
	Resource utilization accuracy
	Highest population coverage
	Avoiding oversupply in rural regions.
   
Machines were allocated using optimization proportionally and M = 50 Machines:
〖Machines〗_m  = Round ( M x 〖StandardizedDemand 〗_m)

Subject to: 
∑_(i=1)^N▒〖Machines〗_m   = 50

## Step 4: Coverage Efficiency Evaluation
To evaluate the efficiency of allocation strategy, the average number of residents served per machine in each municipality must represent coverage efficiency metric, and this metric enables identification of potential oversupply and under-served Suburban areas.
〖Coverage〗_m  =  (P_(m,2024)  )/(〖Machines〗_m  )
CoverageEfficieny =  (∑_(m=1)^N▒P_(m,2024)   )/(50 )

## Step 5: Model Validation Metrics
However, there is no transactional sales data, demographic trend was determined using data science standardized evaluation metrics to compare predicted demand with observed sales at the municipal level:

RMSE (Root Mean Squared Error): Calculate the value of error between observed sales and predicted demand for large deviation.
RMSE =√(〖1/T  ∑_(t=1)^T▒〖(P_(m,t)^actual- P_(m,t)^predicted) 〗〗^2 )  

MAPE (Mean Absolute Percentage Error): Calculate the accuracy of prediction across municipalities, enabling comparison between population size.
MAPE =100/T  ∑_(t-1)^T▒|(P_(m,t)^actual- P_(m,t)^predicted)/(P_(m,t)^actual )|   

Where: 
T=number of years
P_(m,t)^predicted=Trend estimate
​​
## Step 6: Dashboard Integration and Decision Support
All model results with growth rates, demand score, machine allocation, coverage efficiency were developed and visualized into interactive dashboard in Power BI to allow stakeholders to compare between municipalities, make analysis for population, growth patterns, and explore machine distribution.

### **📦 Final Deliverables**
- **📊 Power BI Dashboard:** [Machine Analysis Dashboard](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Machine%20Analysis.pbix)
- **📈 Analysis Files:**
  - [Machine Analysis (Excel)](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Machine%20Analysis.xlsx)
  - [Machine Distribution Data](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Machine%20Distribution.csv)
  - [Population Analysis](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/Population%20Analysis.csv)

---

## **📊 Monitoring & Visualization Engineer – Demand Forecast Dashboard (Joanns' Part)**

This section describes the interactive web dashboard designed to evaluate sales performance, profitability, and demand forecasting using historical sales data. The dashboard provides real-time insights into revenue trends, demand patterns, and predictive analytics to support data-driven decision-making.

### Overview

The Demand Forecast Dashboard is a Flask-based web application that visualizes key performance indicators (KPIs) and provides demand forecasting using Prophet time series models. The dashboard is deployed on Render and accessible publicly for demonstration and educational purposes.

### Key Features

- **Revenue & Profitability Analysis:** Total revenue, profit, and profit margin metrics
- **Data Filtering:** Interactive filtering by municipality and date range
- **Sales Dynamics:** Daily sales volume and revenue trends (last 60 days)
- **Comparative Analysis:** Revenue vs. Profit comparison over time
- **Demand Forecasting:** Weekly aggregation with 60% confidence intervals (6-week horizon)
- **Top Performers:** Top-5 municipalities by revenue and Top-10 products by profit
- **Interactive Visualizations:** Powered by Plotly.js for dynamic charts

### Tech Stack

**Backend:**
- Python (Flask framework)
- Pandas & NumPy for data processing
- Prophet for time series forecasting

**Frontend:**
- HTML (Jinja2 templates)
- Plotly.js for interactive visualizations

**Deployment:**
- Gunicorn WSGI server
- Render cloud platform
- Automatic redeployment on GitHub updates

### Forecasting Methodology

The dashboard implements demand forecasting using Facebook's Prophet library:
- Weekly data aggregation for trend analysis
- Forecast horizon of approximately 6 weeks
- 60% confidence interval for uncertainty quantification
- Supports short-term demand assessment and inventory planning

### **📦 Final Deliverables**
- **🌐 Live Dashboard:** [https://demand-dashboard-19s4.onrender.com/](https://demand-dashboard-19s4.onrender.com/)
- **📂 Source Code:** [demand_dashboard folder](https://github.com/SanitaShu/AI-poject-TSI-Team-/tree/main/demand_dashboard)
- **📖 Documentation:** [Dashboard README](https://github.com/SanitaShu/AI-poject-TSI-Team-/blob/main/demand_dashboard/readme)

### Note
The dataset used in this dashboard is synthetic (fake data), designed for demonstration and educational purposes only. No real transaction or personal data is processed.

---
---
# Monitoring & Visualization Engineer - Analisys of machines financial performance and its forecast  (Joann’s Part)

## Step 7: Analisys of machines financial performance and its forecast
**Demand Forecast Dashboard** — an interactive web dashboard for analyzing sales performance, profitability, and short-term demand forecasting based on historical data.

The dashboard provides insights into revenue, profit, margins, sales dynamics, top municipalities and products, and includes a weekly demand forecast with a confidence interval. Built with **Flask, Pandas, and Prophet**, visualized using **Plotly**, and publicly deployed on **Render**.
Live demo: [https://demand-dashboard-19s4.onrender.com/](https://demand-dashboard-19s4.onrender.com/)
The project source code is located in the `demand_dashboard` folder.


