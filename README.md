
# 🖥️ SILA – Frontend 
The **SILA Frontend** provides the user-facing layer of the national platform that connects **Government Ministries** and **Local Charities** to manage and deliver social support programs.  
It offers a modern and responsive experience that enables seamless interaction with the **SILA Backend API**, ensuring **unified and synchronized data** across all users and entities.



## 📘 Project Description

The **SILA Frontend** serves as the interactive gateway of the SILA ecosystem — empowering ministries and charities to collaborate efficiently through intuitive dashboards and real-time data visualization.  
Built with **React**, **Vite**, and **Tailwind CSS**, it ensures high performance, clean design, and accessible user flows.  
All data within the system is **centrally managed and unified**, guaranteeing consistency between ministry and charity views.

- 🏢 **Ministry Users** can **sign up** to create an official account, then log in to manage and monitor government support programs, track applications, and view analytics through a dedicated dashboard.
  
- 🕊️ **Charity Users** can **sign up** to create a verified charity account, then log in to register beneficiaries, organize charity events, and monitor participation directly through their own dashboard.
 

The frontend securely communicates with the SILA Backend using **JWT-based authentication**, ensuring smooth data exchange and role-based access across all components.  



## 🗂️ Repository Description

This repository contains all **client-side code** for the SILA platform, including:

- **Page Components:** Reusable pages for Home, Programs, Events, Register, and Dashboards.  
- **UI Components:** Modular React components (Navbar, Hero, Footer, etc.) with dedicated style files.  
- **Routing & State Management:** Implemented with React Router and Context API / React Query.  
- **Styling:** Tailwind CSS with custom color palette aligned with the SILA brand identity.  
- **API Integration:** Axios-based communication with the Django backend.  
- **Unified Data Layer:** Ensures consistent and synchronized information across all user types.

---


## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Language** | JavaScript  |
| **Framework / Build Tool** | React 18 + Vite |
| **Styling** |  Tailwind CSS |
| **Routing** | React Router |
| **Development Environment** | Visual Studio Code |
| **Containerization** | Docker |
| **Backend API** | Django REST Framework (Sila-Backend) |
| **Auth** | JWT |


## 👥 User Stories

### 🏢 Ministry User Stories

1. **As a Ministry User**, I want to **sign up and log in securely**, so that I can access my dashboard and manage government support programs.  
2. **As a Ministry User**, I want to **create and edit and delete support programs**, so that these programs appear in the system for future beneficiary applications.  
3. **As a Ministry User**, I want to **view analytics dashboards** with charts and KPIs, so that I can monitor overall performance and regional coverage.  
4. **As a Ministry User**, I want to **review beneficiary applications and approve them** *(feature not yet available)*, so that I can ensure eligibility once beneficiary registration is enabled.  
5. **As a Ministry User**, I want to **export reports (CSV/PDF)**, so that I can share statistics with other government departments.  

## 🕊️ Charity User Stories

1. **As a Charity User**, I want to **sign up and log in**, so that I can manage my organization’s data and activities.  
2. **As a Charity User**, I want to **register beneficiaries** and store their data securely, so that I can later connect them to suitable programs or events *(feature under development)*.  
3. **As a Charity User**, I want to **create, edit, and delete charity events**, so that I can engage the community and track participation.  
4. **As a Charity User**, I want to **see a dashboard summary** (number of beneficiaries, active events, and statistics), so that I can understand our performance at a glance.  
5. **As a Charity User**, I want to **receive program invitations from ministries**, so that I can connect my beneficiaries with available government support.  *(feature under development)*.
6. **As a Charity User**, I want to **accept volunteers** who apply to help in my events, so that I can manage community support effectively.  *(feature under development)*.
7. **As a Charity User**, I want to **receive donations securely** from verified donors, so that I can fund charity programs transparently.  
*(feature under development)*.

## 👤 Beneficiary User Stories *(Future Phase – B2C Expansion)*

1. **As a Beneficiary**, I want to **sign up and create my personal profile**, so that I can apply for programs and events *(not available yet)*.  
2. **As a Beneficiary**, I want to **browse available support programs and charity events**, so that I can see what opportunities exist even if I cannot register yet.  
3. **As a Beneficiary**, I want to **apply directly to programs and events** once the feature is released, so that I can receive support without manual charity registration.  
4. **As a Beneficiary**, I want to **track my eligibility and application status** *(future feature)*.  


## 🔗 Related Repositories & Links

| Repository | Link |
|-------------|------|
| **Frontend Repository** | [Fawatiri Frontend Repo](https://github.com/MuntahaQA/Frontend-finalproject) |
| **Backend Repository** | [Fawatiri Backend Repo](https://github.com/MuntahaQA/Backend-finalproject) | |
| **Live Frontend Site** |http://localhost:5173 |




## 🚀 Installation Instructions Using Docker


1. **Clone the Repository**
   ```bash
   git clone https://github.com/iTKEX/Fawateri_frontend
   cd Fawateri_frontend
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   The application will be available at `http://localhost:5173`


## 🧊 IceBox Features

The following features are planned for future frontend development to enhance user experience, accessibility, and impact across the SILA ecosystem:

- 📱 **Cross-Platform Mobile Application (iOS / Android):**  
  Build a responsive mobile version of SILA using React Native or Flutter to provide real-time access to charity services, event registration, and notifications on the go.

- 🗺️ **Geospatial Information System (GIS) Integration:**  
  Incorporate interactive map components to display nearby charities, active events, and regional program coverage for easier discovery and navigation.

- 👤 **Beneficiary Portal (B2C Expansion):**  
  Introduce a dedicated interface for beneficiaries to  log in, register for charity events, apply for ministry programs, and track their application status.

- 🤖 **AI-Enhanced Interface:**  
  Integrate frontend components that visualize **AI-based beneficiary prioritization** results from the backend — helping ministries and charities easily identify urgent cases.

- 💪 **Volunteer Engagement System:**  
  Allow users to **volunteer with a specific charity**, view available volunteering opportunities, register for events, and track their volunteer hours and impact statistics.

- 💰 **Donation Module:**  
  Enable individuals and organizations to **donate directly to verified charities** through the SILA platform.  
  The feature will include:
  - Secure online payment integration (e.g., Mada, Apple Pay).  
  - Donation tracking and transparency reports.  
  - The ability for donors to see how their contributions are used to support beneficiaries.


- 💡 **Personalized Recommendations:**  
  Implement smart recommendation widgets for both charities and beneficiaries, powered by backend ML models — enhancing engagement and improving program matching.
