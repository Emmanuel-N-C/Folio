<div align="center">

# Folio

### A Social Platform to Showcase Interactive Developer Projects

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.8-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/Java-17-007396?style=for-the-badge&logo=java&logoColor=white)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Explore inventive projects by developers and creators, brought to life through interaction.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Screenshots](#-screenshots) • [License](#-license)

</div>

---

## 📖 About Folio

**Folio** is a modern social platform designed specifically for developers and creators to showcase their projects in an interactive way. Unlike traditional portfolio sites, Folio embeds live demos directly in the feed using iframe previews, allowing users to interact with projects without leaving the platform.

### 🎯 The Problem

- **Portfolios are static** – Screenshots don't capture interactivity
- **Demos are scattered** – GitHub READMEs don't show the experience
- **Communities lack context** – Deployed links get lost in the noise

### ✨ The Solution

Folio provides a feed of **live, interactive projects** where users can:
- 🖱️ **Click, scroll, and interact** with embedded apps directly in the feed
- 💬 **Comment and engage** with creators
- 🔥 **Discover trending projects** from the developer community
- 📱 **Share and showcase** work with a professional, social-first interface

---

## 🚀 Features

### 🎨 **Project Showcase**
- **Live iframe previews** – Interactive project embedding in the feed
- **Fallback screenshots** – Automatic fallback when embedding isn't supported
- **Rich media support** – Multiple screenshots, GitHub links, live demos
- **Tech stack tags** – Highlight technologies used in each project
- **Project descriptions** – Full markdown-style formatting support

### 👤 **User Profiles**
- **Customizable profiles** – Profile pictures, display names, bios
- **Project portfolios** – Organized view of all user projects
- **Follow system** – Follow other developers and creators
- **Activity tracking** – View user likes, comments, and posts

### 💬 **Social Interactions**
- **Real-time comments** – Nested comment threads with replies
- **Like system** – Like posts and comments
- **Real-time notifications** – WebSocket-powered instant notifications
- **@mentions support** – Tag other users in comments
- **Notification center** – Centralized notification management

### 🔐 **Authentication & Security**
- **Email/Password authentication** – Secure JWT-based auth
- **OAuth 2.0 integration** – Google OAuth login
- **Email verification** – Secure account verification flow
- **Password reset** – Forgot password functionality
- **Session management** – Secure token-based sessions
- **Role-based access control** – Admin and user roles

### 🎛️ **User Experience**
- **Dark/Light mode** – Theme toggle with persistent settings
- **Responsive design** – Mobile-first, fully responsive UI
- **Infinite scroll** – Seamless content loading
- **Search functionality** – Find projects and users
- **Trending section** – Discover popular projects
- **Filter & sort options** – Sort by new, old, or top posts

### 🤖 **AI Features**
- **AI chatbot assistant** – Integrated AI help
- **Code review suggestions** – AI-powered code insights
- **Project field generation** – AI-assisted project descriptions
- **Post suggestions** – Smart content recommendations

### 👨‍💼 **Admin Dashboard**
- **User management** – View and manage all users
- **Content moderation** – Moderate posts and comments
- **Analytics & insights** – Platform statistics
- **Role assignment** – Grant/revoke admin privileges

### 🔔 **Real-Time Features**
- **WebSocket integration** – Live updates without refresh
- **Real-time notifications** – Instant notification delivery
- **Online status** – See who's active
- **Live comment updates** – Comments appear instantly

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19.2.0
- **Routing:** React Router DOM 7.9.6
- **Styling:** Tailwind CSS 3.4.18
- **UI Components:** Radix UI (Dialog, Dropdown, Toast, etc.)
- **State Management:** Zustand 5.0.8
- **HTTP Client:** Axios 1.13.2
- **Build Tool:** Vite 7.2.4
- **Icons:** Lucide React 0.554.0
- **Date Handling:** date-fns 4.1.0
- **AI Integration:** Vercel AI SDK 5.0.98
- **OAuth:** @react-oauth/google 0.12.2

### **Backend**
- **Framework:** Spring Boot 3.5.8
- **Language:** Java 17
- **Database:** PostgreSQL (H2 for testing)
- **Authentication:** Spring Security + JWT (JJWT 0.12.3)
- **ORM:** Spring Data JPA
- **Email Service:** SendGrid 4.10.2
- **File Storage:** AWS S3 SDK 2.20.26
- **WebSocket:** Spring WebSocket
- **OAuth:** Spring OAuth2 Client
- **GitHub Integration:** GitHub API 1.321
- **Google OAuth:** Google API Client 2.2.0
- **Build Tool:** Maven
- **Development:** Spring DevTools, Lombok

### **DevOps & Tools**
- **Version Control:** Git
- **API Testing:** Postman (collection included)
- **Environment Management:** Spring DotEnv
- **Code Quality:** ESLint
- **Database Migration:** Spring Data JPA Auto-DDL

---


## 📸 Screenshots

### Landing Page
The welcoming landing page showcases the platform's value proposition with a modern, clean design.
<img width="1883" height="891" alt="image" src="https://github.com/user-attachments/assets/4217232d-efc1-49ab-b9f4-8beb92aa0bf8" />
---

### Feed Page
Scroll through a feed of live, interactive projects with embedded iframes, comments, and likes.
<img width="1889" height="863" alt="Screenshot 2025-12-19 133916" src="https://github.com/user-attachments/assets/745010f1-0f58-4903-bc96-c219352d1f38" />

<img width="1902" height="902" alt="Foliofeed2" src="https://github.com/user-attachments/assets/3a0bd011-cf5b-4bd4-a2ed-f82269e5b186" />

---

### Project Creation
Intuitive multi-step project creation with live preview support, screenshot uploads, and tech stack tagging.

<img width="1887" height="897" alt="Createpostfolio" src="https://github.com/user-attachments/assets/58e0063c-53e9-4f42-ab27-a652b09c3994" />

---
### AI Assited Project Creation
<img width="1903" height="888" alt="CreatepostAiAssist" src="https://github.com/user-attachments/assets/6e84a821-f12a-43bc-8e76-1c3ac293112f" />

---
### User Profile
Customizable user profiles displaying all projects, bio, social links, and activity.

<img width="1904" height="883" alt="usrprofile1" src="https://github.com/user-attachments/assets/c3836aec-60ac-470d-8d9f-902eac191708" />

---
<img width="1899" height="899" alt="Usrprofile2" src="https://github.com/user-attachments/assets/eb86e0c1-4872-41a2-99dd-e007ec9c20fc" />

---

### Notifications
Real-time notification center keeping users updated on likes, comments, and mentions.

<img width="1895" height="893" alt="Notifications" src="https://github.com/user-attachments/assets/b5d11f1c-c9dc-44d1-81b1-f895bd8544bb" />

---
### Theme

<img width="1889" height="891" alt="Themefeaturefolio" src="https://github.com/user-attachments/assets/bad4e226-87ae-4fde-a281-68e2a9a5215a" />

---
## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request




