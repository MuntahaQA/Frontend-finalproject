
# 🖥️ SILA – Frontend (Client Interface & User Experience)

The **SILA Frontend** delivers a responsive, bilingual web interface for the unified charity data ecosystem.  
It enables seamless interaction between **Charities**, **Beneficiaries**, and **Ministry partners** through intuitive dashboards, visual analytics, and real-time data views powered by the SILA backend API. 

## 📘 Project Description

The **SILA Frontend** provides the interactive layer of the unified charity data ecosystem, connecting users with verified information managed by the backend.  
It is designed to offer a **clean, accessible, and bilingual (AR/EN)** interface that enables different user roles to interact with SILA efficiently:

- **Ministry (Super User):** accesses a centralized dashboard (via Django Admin backend) to monitor charities, programs, and national data.  
- **Charity Admin:** manages beneficiaries, creates and tracks charity events, and views participation statistics.  
- **Beneficiary:** logs in to view or edit their profile, register for charity events, and apply for available support programs.

The frontend integrates tightly with the SILA backend API to display live data, handle secure authentication, and deliver responsive dashboards optimized for both desktop and mobile users.

## 🧩 Tech Stack

- **Development Environment:** Visual Studio Code  
- **Programming Language:** JavaScript (ES6+)  
- **Framework / Build Tool:** React 18 + Vite  
- **Styling:** Tailwind CSS  
- **State Management:** React Query / Context API  
- **Routing:** React Router  
- **Authentication:** JWT (integrated with SILA Backend API)  
- **Data Source:** SILA Backend (Django REST API with PostgreSQL database)  
- **Deployment:** Vercel / Netlify / Render  
- **Containerization:** Docker


## 🔗 Related Repositories & Links

| Repository Name | Link |
|------|------|
| **Frontend Repository** | [SILA Frontend Repo](https://github.com/MuntahaQA/sila_frontend) |
| **Backend Repository** | [SILA Backend Repo](https://github.com/MuntahaQA/sila_backend) |
| **Live Backend Site (API)** | 



## 🚀 Installation Instructions

### Option 1: Using Docker (Recommended)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MuntahaQA/sila_frontend
   cd sila_frontend
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   The application will be available at `http://localhost:5173`

### Option 2: Manual Installation

1. **Clone the Repository**
   ```bash
git clone https://github.com/MuntahaQA/sila_frontend
cd sila_frontend
   ```

2. **Install Dependencies**
   ```bash
npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Run Development Server**
   ```bash
npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🧊 IceBox Features
The following features are planned for future frontend development to enhance user experience, accessibility, and impact across the SILA ecosystem:

- **📱 Cross-Platform Mobile Application (iOS / Android):**  
  Build a responsive mobile version of SILA using React Native or Flutter to provide real-time access to charity services, event registration, and notifications on the go.

- **🗺️ Geospatial Information System (GIS) Integration:**  
  Incorporate interactive map components to display nearby charities, active events, and regional program coverage for easier discovery and navigation.

- **🤖 AI-Enhanced User Interface:**  
  Integrate frontend components that visualize AI-based beneficiary prioritization results from the backend — enabling administrators to see urgent cases clearly through dashboards and charts.

- **🏛️ Program-Owner Ministry Portal (Frontend Interface):**
  Provide a dedicated portal for *program-owning ministries* (e.g., Ministry of Housing → Sakani, Ministry of Education → Takaful) to sign in and manage **their own programs only**. 
  The portal lets them:
  - View program dashboards (applications, eligibility funnel, regional coverage).
  - See which beneficiaries registered/applied to *their* programs.

- **📊 Advanced Analytics Dashboard:**  
  Create interactive data visualizations (charts, KPIs, and performance metrics) using libraries like Recharts or Chart.js for administrators and policymakers.

- **💡 Personalized Recommendations:**  
  Implement UI elements for donor and beneficiary suggestions powered by backend ML models — enhancing engagement and relevance.
