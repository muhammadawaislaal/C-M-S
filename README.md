# 🎓 C-M-S: Premium Course Management System

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-1.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-purple)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind-cyan)

> **Redefining the Learning Experience.**
> C-M-S is a high-fidelity, enterprise-grade learning platform. It combines a sophisticated "glassmorphic" design with robust administrative tools and engaging student features to deliver a world-class educational environment.

---

## ✨ Key Features

### For Students: The "Prime" Experience
*   **Gamified Dashboard**: Personal greetings, real-time GPA tracking, and XP-based achievement systems.
*   **Academic Pro Sidebar**: Quick access to all learning materials, curated with a clean, modern aesthetic.
*   **Cinematic Lecture Viewer**: Immersive learning interface for video lectures and PDF resources.
*   **Achievement Center**: Track your progress with a visual badge system and certification milestones.
*   **Community Hubs**: Course-specific discussion forums to engage with peers and instructors.

### For Administrators: Command & Control
*   **Data-Rich Dashboard**: Comprehensive analytics on student engagement, course popularity, and system activity.
*   **Assessment Center**: Full-featured tool for creating quizzes, managing questions, and grading submissions.
*   **User Orchestration**: Streamlined interface for manual student enrollment and staff management.
*   **Global Announcements**: Broadcast high-impact updates across specific courses or the entire organization.
*   **Secure Authentication**: Role-based access with a stunning 3D-illustrated login gateway.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | ![React](https://img.shields.io/badge/-React_18-61DAFB?logo=react&logoColor=black) | Component-based, lightning-fast UI. |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) | Utility-first styling for a pixel-perfect design. |
| **Animations** | ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white) | Premium micro-interactions and transitions. |
| **Icons** | ![Lucide](https://img.shields.io/badge/-Lucide_Icons-orange) | Modern, consistent iconography for all roles. |
| **State & Auth** | **Context API + JWT** | Secure session management and global state. |
| **Routing** | **React Router v6** | Declarative, role-aware routing architecture. |

---

## 🎨 Design Philosophy: "The Wow Factor"

Our platform is built on the **"Glassmorphism 2.0"** standard:
*   **Visual Depth**: Soft shadows, translucent layers (Glassmorphism), and curated HSL color palettes.
*   **Micro-Animations**: Every interaction—hovers, clicks, and page entries—is powered by Framer Motion for a fluid feel.
*   **3D Visuals**: Custom-generated 3D character assets enhance engagement on key entry points.
*   **Responsive Integrity**: Flawless functionality across mobile phones, tablets, and wide-screen desktops.

---

## 🚀 Getting Started

1.  **Clone & Install**
    ```bash
    git clone https://github.com/awais-laal/CMS-frontend.git
    cd CMS-frontend
    npm install
    ```

2.  **Environment Setup**
    Configure your `.env` file:
    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```

3.  **Run Development**
    ```bash
    npm run dev
    ```
    Access the portal at `http://localhost:5173`.

---

## 📂 Project Structure

```text
src/
├── api/             # Axios configuration & interceptors
├── assets/          # 3D Illustrations & Branding
├── components/      # Atomic UI components (Cards, Sidebars)
├── context/         # Auth & Global State providers
├── layouts/         # Role-specific dashboard structures
├── pages/           # High-fidelity views (Admin/Student)
└── services/        # Isolated API orchestration logic
```

---

*© 2025 C-M-S Platform. Developed by Awais laal & Team.*
