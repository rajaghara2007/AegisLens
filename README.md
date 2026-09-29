# 🛡️ AegisLens

### Security Assessment & Vulnerability Intelligence Platform

**AegisLens** is a modern security assessment and vulnerability intelligence platform designed to help security teams **assess assets, identify vulnerabilities, analyze risk, validate findings, manage remediation, and generate security reports** from a centralized dashboard.

The platform provides an interactive security operations interface with assessment management, asset inventory, vulnerability findings, CVSS scoring, risk visualization, AI-assisted analysis, remediation tracking, audit logs, and reporting capabilities.

---

## 🚀 Features

### 📊 Security Dashboard

Get a centralized overview of security assessments, findings, assets, risk levels, and security activities.

### 🎯 Security Assessments

Create and manage security assessments through a guided workflow, including scope configuration and assessment execution.

### 🖥️ Asset Inventory

Maintain an inventory of assets and monitor their security assessment status.

### 🔎 Vulnerability Findings

View, analyze, and manage discovered security findings with detailed vulnerability information.

### 📈 CVSS Calculator

Calculate and evaluate vulnerability severity using the **Common Vulnerability Scoring System (CVSS)**.

### 🔥 Risk Heatmap

Visualize security risks and prioritize vulnerabilities based on their severity and impact.

### 🧪 Retest & Validation

Validate previously identified vulnerabilities and perform retesting workflows to determine whether issues have been successfully remediated.

### 🤖 AI Security Assistant

Use the integrated AI assistant interface to support vulnerability analysis and security assessment workflows.

### 📋 Remediation Management

Track vulnerability remediation using a Kanban-style workflow, helping teams organize and monitor security fixes.

### 📄 Security Reports

Generate structured security assessment reports from collected findings and assessment data.

### 🔐 Audit Logs

Track important security and application activities through centralized audit logging.

### 🔌 Plugin Architecture

AegisLens includes a plugin-oriented backend structure that can be extended with additional security capabilities.

### 🎯 Simulated Target Application

The backend includes a simulated target application that can be used for testing assessment and validation workflows in a controlled environment.

---

## 🏗️ Architecture

AegisLens is organized into two primary applications:

```text
AegisLens
│
├── frontend/              # React + Vite frontend
│   ├── components/
│   ├── context/
│   ├── screens/
│   └── ...
│
├── backend/               # Express + TypeScript API
│   ├── src/
│   │   ├── routes/
│   │   ├── target/
│   │   └── ...
│   └── ...
│
└── README.md
```

### Frontend

The frontend is built with:

* ⚛️ React
* ⚡ Vite
* 📘 TypeScript
* 🎨 Tailwind CSS
* 📊 Recharts
* 🧩 Lucide React

The application provides dedicated interfaces for dashboards, assessments, findings, assets, CVSS calculations, risk analysis, AI assistance, remediation, reports, audit logs, and settings.

### Backend

The backend is built with:

* 🟢 Node.js
* 🚂 Express
* 📘 TypeScript
* 🌐 CORS
* 🔐 dotenv

The API exposes separate endpoints for assessments, findings, assets, scope, plugins, canary functionality, AI functionality, reports, audit logs, settings, and events.

---

## 🔌 API Endpoints

The backend provides the following primary API resources:

```text
/api/health
/api/assessments
/api/findings
/api/assets
/api/scope
/api/plugins
/api/canary
/api/ai
/api/reports
/api/audit-logs
/api/settings
/api/events
```

A simulated target application is also available at:

```text
/target
```

Health check:

```text
GET http://localhost:4000/api/health
```

---

## 🛠️ Tech Stack

| Layer        | Technology        |
| ------------ | ----------------- |
| Frontend     | React             |
| Build Tool   | Vite              |
| Language     | TypeScript        |
| Styling      | Tailwind CSS      |
| Charts       | Recharts          |
| Icons        | Lucide React      |
| Backend      | Node.js + Express |
| API          | REST              |
| Development  | TSX               |
| Code Quality | Oxlint            |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rajaghara2007/AegisLens.git
cd AegisLens
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on:

```text
http://localhost:4000
```

Verify the API using:

```text
http://localhost:4000/api/health
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will provide the local development URL in the terminal.

---

## 🔐 Security & Assessment Workflow

AegisLens is designed around a structured security assessment workflow:

```text
Create Assessment
       ↓
Configure Scope
       ↓
Assess Target
       ↓
Discover Assets
       ↓
Identify Findings
       ↓
Analyze Severity
       ↓
Calculate CVSS
       ↓
Visualize Risk
       ↓
Validate / Retest
       ↓
Track Remediation
       ↓
Generate Report
```

This workflow helps organize security testing from initial assessment through remediation and reporting.

---

## 📸 Platform Modules

The application contains dedicated modules for:

* Dashboard
* Assessment Management
* Scope Configuration
* Assessment Execution
* Asset Inventory
* Vulnerability Findings
* Finding Details
* Validation Sandbox
* Retesting
* CVSS Calculator
* Risk Heatmap
* AI Assistant
* Remediation Kanban
* Report Generation
* Audit Logs
* Settings
* Authentication

---

## 🎯 Project Goals

The main goals of AegisLens are to:

* Centralize security assessment workflows
* Improve vulnerability visibility
* Simplify security risk analysis
* Provide structured vulnerability management
* Support CVSS-based severity assessment
* Track remediation progress
* Provide security reporting capabilities
* Maintain an auditable record of security activities
* Provide a foundation for extending security assessment functionality

---

## 🧪 Development

### Build Frontend

```bash
cd frontend
npm run build
```

### Lint Frontend

```bash
cd frontend
npm run lint
```

### Build Backend

```bash
cd backend
npm run build
```

### Run Backend

```bash
cd backend
npm start
```

---

## ⚠️ Disclaimer

AegisLens is intended for **authorized security assessment, testing, research, and educational purposes**.

Only use the assessment and validation capabilities against systems, applications, and infrastructure that you own or have explicit permission to test.

---

## 🤝 Contributing

Contributions, ideas, improvements, and bug reports are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

---

## 📄 License

This project currently uses the license configuration defined in the repository.

---

## 👨‍💻 Author

Developed as **AegisLens — Security Assessment & Vulnerability Intelligence Platform**.

⭐ If you find this project useful, consider giving the repository a star!

**Repository:** https://github.com/rajaghara2007/AegisLens
