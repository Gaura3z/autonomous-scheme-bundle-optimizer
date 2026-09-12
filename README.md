# 🏛️ PS16: Autonomous Decision-Support & Conflict-Free Welfare Scheme Bundle Optimizer for Citizens

> **Kurukshetra 2.0 Hackfest 2026** | **Problem Statement Code: PS16**  
> **Team ID / Name**: `KH001-TeamName`

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC.svg)](https://tailwindcss.com/)

---

## 📌 1. Executive Summary & Problem Context

Citizens navigating welfare schemes in India (across 4,770+ Central and State programs) face three critical systemic bottlenecks:
1. **Discovery Fragmentation**: Information is siloed across hundreds of ministry portals and state departments with ambiguous eligibility criteria.
2. **Statutory Clawbacks & Mutually Exclusive Conflicts**: Applying for two conflicting schemes (e.g. state farm input subsidy + central pension or overlapping higher education scholarships) often results in application rejection, clawback penalties, or permanent disqualification.
3. **Application Friction**: Lack of sequenced prerequisite roadmaps and document inventories leads to abandoned registrations and missed deadlines.

**Our Solution**: **SchemeWise** is an **Autonomous Decision-Support and Conflict-Free Scheme-Bundle Optimizer** inspired by official **myScheme (MeitY/NeGD)** citizen-service design standards. It evaluates citizen profiles deterministically, eliminates statutory conflicts using an exclusion matrix, maximizes total monetary and social utility, and produces an actionable, sequenced document roadmap without requiring Aadhaar or sensitive uploads.

---

## 🚀 2. Core Capabilities & Innovation

| Feature | Description |
| :--- | :--- |
| **SchemeWise Citizen Experience** | SchemeWise implementation inspired by official myScheme & Digital India standards: civic emblem, search bar, language switcher, pastel stat cards, and 3-way categories/states/ministries tabs. |
| **Autonomous Deterministic Engine** | Rule-evaluation pipeline matching demographic, regional, and livelihood attributes against gazette conditions without hallucination. |
| **Conflict & Exclusion Matrix** | Detects mutually exclusive programs (e.g., dual scholarship exclusions, institutional farmer income restrictions) and resolves them to maximize net citizen benefit. |
| **Document Prerequisite Sequencer** | Identifies the minimal common set of documents needed (Aadhaar, Land Record 7/12, Income Certificate, etc.) and generates a phased timeline. |
| **Interactive SchemeBot AI** | Embedded bottom-right assistant mascot for natural language citizen queries and instant sector navigation. |
| **Zero Document Uploads Required** | Pure client-side privacy-first evaluation — citizens don't risk sharing sensitive identities for initial discovery. |
| **Demo Citizen Personas** | 1-click evaluation profiles for judges: Small Marginal Farmer, College SC/ST Student, Urban Street Vendor, and Rural Homemaker. |

---

## 📂 3. Repository Structure

This repository strictly adheres to the Kurukshetra 2.0 evaluation structure:

```
KH001-TeamName/
├── README.md                  # Comprehensive Project Overview & Evaluation Guide
├── LICENSE                    # MIT Open Source License
├── package.json               # Dependencies & Build Configuration
├── .gitignore                 # Standard Node/React Ignore Rules
│
├── src/                       # Complete Application Source Code
│   ├── components/            # Modular React UI Components
│   │   ├── layout/            # Navbar, Header, Accessibility Bar, SubNav
│   │   ├── stages/            # LandingPage, AssessmentWizard, SchemeCatalog, Roadmap
│   │   └── ui/                # SchemeBot, MetricCards, Modals, Personas
│   ├── engine/                # Core Rule Matcher & Conflict Elimination Engine
│   ├── data/                  # Verified Scheme Gazette Definitions & Exclusion Rules
│   ├── types/                 # Shared TypeScript Types & Interfaces
│   ├── App.tsx                # Main Applet Controller & Stage Router
│   ├── main.tsx               # Application Entry Point
│   └── index.css              # Global Tailwind CSS Styles
│
├── docs/                      # Technical Documentation & Diagrams
│   ├── project-documentation.md # Algorithmic Details & Architecture Specification
│   ├── architecture.svg       # Visual System Architecture Diagram
│   └── other-diagrams/        # Sequence & Decision Flow Diagrams
│
├── screenshots/               # High-Resolution Application Screenshots
│   ├── README.md              # Screenshot descriptions
│   ├── screenshot-1.png       # SchemeWise Hero & Smartphone Mockup
│   └── screenshot-2.png       # 3-Stat Metric Cards & Category Grid
│
└── data/                      # Dataset Specifications & Schemas
    ├── README.md              # Data dictionary & statutory schema docs
    └── sample_schemes.json    # Verified sample scheme definitions
```

---

## 🛠️ 4. Technology Stack

- **Frontend Core**: React 19, TypeScript 5.8
- **Build & Dev Tooling**: Vite 6.2, Node.js
- **Styling & Design System**: Tailwind CSS v4, Lucide React icons
- **Physics & Animations**: `motion` (Framer Motion v12)
- **Local Persistence & Privacy**: Client-side secure state (zero sensitive data exfiltration)

---

## ⚡ 5. Quick Start & Local Setup

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher (or pnpm / yarn / bun)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/YourUsername/KH001-TeamName.git
cd KH001-TeamName

# 2. Install dependencies
npm install

# 3. Start the development server (Binds to 0.0.0.0:3000)
npm run dev

# 4. Open in browser
http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 6. Testing with Demo Personas (For Judges)

To test the bundle optimizer instantly without typing manual details:
1. Open the homepage at `http://localhost:3000`.
2. Click the **"Demo Citizen Personas"** button in the header or hero banner.
3. Select any of the pre-loaded profiles:
   - **Ramesh Patel (Small Marginal Farmer, Gujarat)**: Evaluates PM-KISAN, PM Surya Ghar, Soil Health Card, and Kisan Credit Card.
   - **Pooja Kumari (B.Tech College Student, Bihar)**: Evaluates Central Sector Post-Matric Scholarship and Skill India AICTE benefits while eliminating conflicting dual state stipends.
   - **Mohd. Rafiq (Urban Street Vendor, Uttar Pradesh)**: Tests PM SVANidhi working capital tranche progression and Mudra loan bundling.
4. Watch the engine automatically prune conflicting schemes and construct an optimized, high-yield application bundle!

---

## 👥 7. Team Details

| Role | Name | Email |
| :--- | :--- | :--- |
| **Team Lead / Full Stack** | Savita Biradar | savitabiradar109@gmail.com |
| **Problem Statement** | PS16: Autonomous Decision-Support Optimizer | Kurukshetra 2.0 Hackfest |

---
*Built with ❤️ for Digital Public Infrastructure (DPI) & Citizen Empowerment.*
