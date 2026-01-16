# 🚀 DevTinder - Tinder for Developers

<div align="center">
  <img src="../devTinder/frontend/public/vite.svg" alt="DevTinder Banner" height="100"/>
  <br>
  <br>
  
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![AWS](https://img.shields.io/badge/Deployed_on-AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
</div>

<br>

**DevTinder** is a platform designed to connect developers. Just like Tinder, but for finding your next coding partner, mentor, or hackathon teammate. Swipe, match, and chat in real-time to collaborate on projects.

☁️ **Deployed on AWS** for scalable performance and reliability.

---

## ✨ Features

*   **🔐 Secure Authentication**: Robust JWT-based authentication with cookie management.
*   **👤 Comprehensive Profiles**: Rich user profiles with skills, GitHub/LinkedIn links, and photo uploads (powered by Cloudinary).
*   **❤️ Matching System**: Swipe interface to connect with other developers based on skills and interests.
*   **💬 Real-Time Chat**: Instant messaging with matched users using **Socket.IO**.
*   **🎨 Modern UI**: Fully responsive and beautiful interface built with **React** and **Tailwind CSS**.
*   **🛡️ Robust Backend**: Scalable RESTful API built with **Express.js**, incorporating **validator.js** for rigorous data validation and sanitization to ensure system integrity.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React](https://react.dev/) (via Vite)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: React Router
*   **HTTP Client**: Axios

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Real-time**: Socket.IO
*   **Authentication**: BCrypt & JWT
*   **File Storage**: Cloudinary (with Multer)

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   MongoDB Atlas Account (or local MongoDB)
*   Cloudinary Account

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/poshithNandyala/devTinder.git
    cd devTinder
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=7777
    DB_CONNECTION_SECRET=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
    Start the server:
    ```bash
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```
    Start the client:
    ```bash
    npm run dev
    ```
    The application should now be running at `http://localhost:5173`.

---

## 📸 Screenshots

| Login Screen | Feed | Chat |
|:---:|:---:|:---:|
| ![Login](https://via.placeholder.com/300x500?text=Login) | ![Feed](https://via.placeholder.com/300x500?text=Feed) | ![Chat](https://via.placeholder.com/300x500?text=Chat) |

---

## 🤝 Application Flow

1.  **Register/Login**: Users create an account or log in.
2.  **Create Profile**: Update profile details, upload photos, and list skills.
3.  **Browse**: View other developers' profiles on the feed.
4.  **Connect**: Send connection requests (swipe right).
5.  **Match**: If the other user accepts, it's a match!
6.  **Chat**: Start a real-time conversation.

---



<div align="center">
  Made with ❤️ by <b>Poshith Nandyala</b>
</div>
