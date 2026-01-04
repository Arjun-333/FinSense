# 💰 FinSense - Smart Expense Tracker

FinSense is a **Progressive Web App (PWA)** designed to look and feel like a premium mobile app. It features Smart SMS Parsing, Expense Trends, and Dark Mode.

## 🚀 How to Run Locally (Developer Mode)

You need **two** terminals open to run the full stack (Frontend + Backend).

### 1. Start the Backend (Server)

This manages the Database (MongoDB) and API.

```bash
cd backend
npx nodemon server.js
```

_Port: 5000_

### 2. Start the Frontend (UI)

This runs the React Interface.

```bash
cd frontend
npm run dev
```

_Port: 5173_

### 3. Open the App

- Go to: **[http://localhost:5173](http://localhost:5173)**
- **Mobile View**: Right-click > Inspect > Toggle Device Toolbar (Ctrl+Shift+M) to see the mobile layout.

---

## 📲 How to Share / "Send" the App

Since this is a **PWA (Web App)**, you have two options:

### Option A: The Web Way (Recommended for Hackathons) 🌐

You **deploy** the website to the internet. Users visit the link and click "Add to Home Screen".

1.  Push code to GitHub.
2.  Connect GitHub repo to **Vercel** or **Render**.
3.  **Share the URL** (e.g., `finsense.vercel.app`).
4.  Users install it instantly (No APK download needed).

### Option B: The Native APK Way (Advanced) 🤖

To get a real `.apk` file that you can send via WhatsApp:

1.  You must convert this project using **Capacitor**.
2.  **Requirement**: You MUST have **Android Studio** installed on your PC to build the final file.
3.  Commands:
    ```bash
    cd frontend
    npm install @capacitor/core @capacitor/cli @capacitor/android
    npx cap init
    npx cap add android
    npm run build
    npx cap sync
    npx cap open android
    ```
4.  Then, inside Android Studio, you click "Build APK".

---

## 🛠️ Features

- **Smart Paste**: Auto-detects amount/merchant from SMS text.
- **Trends**: Visual charts of your spending.
- **Theme**: Dark/Light mode toggle.
- **Security**: Duplicate transaction detection.
