# security-we-app-
simple student security we  application # 🔐 Mobile Security Lock with Emergency Access

A full-stack web and mobile application that enhances smartphone security by requiring users to solve a dynamic code puzzle before accessing their phone. It also includes an emergency access option for temporary usage.

---

## 🚀 Features

### 🔒 Security Code Lock
- Generates a unique code every time the user wants to unlock the phone.
- Requires solving the code to gain access.
- Protects against brute force by limiting failed attempts.
- Code difficulty configurable via Admin Panel.

### 🆘 Emergency Access Mode
- Tap the "Emergency Key Bar" to unlock the phone for 2 hours.
- Security code lock reactivates after the 2-hour session ends.
- Emergency key resets **only after**:
  - A correct code is solved, or
  - The phone restarts.

### 🛠 Admin Panel
- View access logs and usage history.
- Set code types, difficulty level, and lock behavior.
- Manage user accounts and device preferences.

---

## 🧱 Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React.js / Next.js |
| Mobile App  | React Native / Capacitor.js |
| Backend     | Node.js with Express |
| Database    | MongoDB / PostgreSQL |
| Auth        | JWT / OAuth 2.0 |
| Storage     | SecureStore / LocalStorage |
| UI Design   | Tailwind CSS / Material UI |

---

## 📲 How It Works

1. Install the app and grant necessary permissions (Overlay + Accessibility).
2. On every screen wake or phone unlock, a code challenge appears.
3. User must solve the challenge to access the device.
4. In case of urgency, use the "Emergency Key Bar" for 2 hours of full access.
5. After that, the code lock returns automatically.
6. Emergency access resets only after a successful code solve or device restart.

---

## ⚙️ Installation & Setup

### 📱 Mobile App

```bash
git clone https://github.com/your-username/security-lock-app.git
cd mobile-app
npm install
npm run android   # or npm run ios

