<div align="center">
  <img src="/public/logo.png" width="120" height="120" alt="NEKOLEAK Logo" style="border-radius: 20%; box-shadow: 0 0 50px rgba(220, 38, 38, 0.4);" />
  <h1 align="center">NEKOLEAK — NEXUS OPS 2026</h1>
  <p align="center">
    <strong>Premium Anime Streaming & Leak Archive System</strong><br />
    <em>High-performance, encrypted access, and professional aesthetics.</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Access-Restricted-red?style=for-the-badge" alt="Access" />
  </p>
</div>

---

## ⚡ Overview

**NEKOLEAK** adalah platform bok#p anime & JAV berdasarkan situs Nekopoi.

## 🚀 Key Features

- 💎 **Premium UI/UX**: Antarmuka halus, responsif, dan energetik dengan skema warna *Midnight & Crimson*.
- 🔐 **Restricted Access Area**: Sistem verifikasi identitas `NK-XXXXXX` sebelum masuk ke database.
- 🤖 **Telegram Key Integration**: Bot otomatis untuk distribusi kunci akses secara real-time.
- 📡 **Zero Hardcoded API**: Konfigurasi murni berbasis *Environment Variables* (Vercel-ready).
- ⚡ **High-Speed Streaming**: Proxy cerdas dengan sistem caching 10 menit untuk meminimalkan latensi.
- 📱 **Mobile Optimized**: Transisi halus dan layout skalabel untuk segala ukuran layar.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite.
- **Styling**: Tailwind CSS (Custom Design System).
- **Icons**: Lucide React.
- **API Engine**: Gemini GenAI & Custom Proxy Logic.
- **Backend Edge**: Vercel Serverless Functions (Node.js).

## ⚙️ Environment Variables

Untuk menjalankan aplikasi ini, Anda **WAJIB** mengonfigurasi variabel berikut di `.env.local` atau Dashboard Vercel:

| Variable | Deskripsi |
| :--- | :--- |
| `BASE_PROXY_URL` | Endpoint API |
| `TELEGRAM_TOKEN` | TELEGRAM TOKEN BOT |

## 📦 Installation & Setup

1. **Clone Repositori**
   ```bash
   git clone https://github.com/21sysai/NekoLeak.git
   cd NekoLeak
   ```

2. **Install Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Buat file `.env.local` dan isi dengan variabel di atas.

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

## 🤖 Telegram Bot Setup

1. Chat @BotFather di Telegram, buat bot baru, dan ambil API Token-nya.
2. Set URL Webhook ke: `https://domain-anda.vercel.app/api/webhook`.
3. User cukup mengirimkan perintah `/start` ke bot Anda untuk mendapatkan **Access Key**.

## 🛡 Security & DMCA

- **Encrypted Traffic**: Seluruh request ke backend diproteksi melalui proxy layer.
- **Hotlink Protection**: Implementasi `no-referrer` pada seluruh aset visual.
- **DMCA Compliant**: Aplikasi ini tidak menyimpan file di server sendiri, hanya berperan sebagai pengindeks konten pihak ketiga.

---

<div align="center">
  <p><strong>Nexus Ops Team</strong></p>
  <p>© 2026 NEKOLEAK - Authorized Access Only</p>
</div>
