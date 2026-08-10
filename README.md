# ⚡ MUTER — GoPay Merchant Gateway & Dynamic QRIS Engine
> **Official Credit:** Developed & Maintained by **Muter by duacincin.id**  
> **Official Site:** [duacincin.id](https://duacincin.id)

---

## 🏢 System Architecture & Overview

**Muter** is an enterprise-grade, self-hosted API Gateway engineered in Node.js for GoPay / GoBiz Merchants. It provides automated transaction verification, seamless session management, and dynamic EMVCo QRIS generation with zero third-party payment gateway fees.

```text
+------------------+         +------------------+         +------------------+
|   Client App /   |  -----> |   MUTER GATEWAY  |  -----> |   GoPay / GoBiz  |
|  E-Commerce Web  |  <----- |  (duacincin.id)  |  <----- |   Analytics API  |
+------------------+         +------------------+         +------------------+
                                       |
                                       v
                             +-------------------+
                             | Local Dynamic QR  |
                             |  Parser & Engine  |
                             +-------------------+
```

---

## 🌟 Highlight Features

| Module | Features & Capabilities |
| :--- | :--- |
| **🔐 Terminal Authentication** | Native GoBiz OTP authentication (`node login.js`) saved locally in `.GOPAY_SESI_JANGAN_DIHAPUS.json`. |
| **🔄 Auto-Refresh Engine** | Automated token rotation every 6 hours in the background — continuous 24/7 session continuity. |
| **🧾 Dynamic QRIS Generation** | Real-time EMVCo parsing and CRC16 checksum computation based on static merchant QR. |
| **🛡️ Anti-Collision TRX Lock** | Strict `trx_id` claim mapping prevents duplicate verification when multiple customers pay identical amounts. |
| **💻 Interactive Web Checkout** | Sleek dark UI with live 5-minute countdown, manual instant check button, and optional 8s auto-polling toggle. |
| **⚙️ Dual Interface Protocols** | Full support for `GET` query strings & `POST` JSON payloads with `X-Api-Key` authentication. |

---

## ⚙️ Environment Configuration (`.env`)

Before starting Muter Gateway, ensure `.env` file is properly configured:

```env
# Server Port Configuration
PORT=3000

# Secret API Key Authentication
API_KEY=your_secret_api_key_here

# Static QRIS String from GoBiz App
QRIS_STATIC=00020101021126610014COM.GO-JEK.WWW01189360091435898784490210G5898784490303UMI51440014ID.CO.QRIS.WWW0215ID10264771444000303UMI5204899953033605802ID5925duacincin.id - Undangan O6013JAKARTA PUSAT61051071062070703A016304852C

# GoPay Merchant ID (Optional)
GOPAY_MERCHANT_ID=your_merchant_id_here
```

---

## 🚀 Quick Start & Initial Setup

### 1. Installation
```bash
npm install
```

### 2. Configure Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
```bash
cp .env.example .env
```

### 3. One-Time Terminal OTP Authentication
```bash
node login.js
```
Follow the interactive prompt: enter your registered GoBiz mobile number and the 4-digit SMS/WA OTP. Session tokens are stored locally and refreshed automatically.

---

## 📦 Deployment Matrix

### A. Production VPS Deployment (PM2 Process Manager)
```bash
# Install PM2 Process Manager
sudo npm install -g pm2

# Launch Muter Gateway Service
pm2 start server.js --name "muter-gopay-gateway"

# Save configuration for automatic reboot recovery
pm2 save
pm2 startup
```

### B. Containerized Deployment (Docker)
```bash
# Ensure .env and session files exist, then execute:
docker compose up -d
```

### C. cPanel Shared Hosting (Node.js App)
> [!IMPORTANT]
> **Node.js Version Requirement:** Always select **Node.js 18.x** in cPanel. Avoid Node 20.x on CloudLinux due to WebAssembly virtual memory limits.

1. Upload project files to your cPanel directory.
2. In **Setup Node.js App**, set **Application Startup File** to `server.js` and select Node.js `18.x`.
3. Run `setup.sh` via cPanel Terminal:
   ```bash
   bash setup.sh
   ```
4. Click **Restart Application** in cPanel.

### D. Pterodactyl Application Panel
1. Perform one-time OTP login locally (`node login.js`).
2. Upload project files and `.GOPAY_SESI_JANGAN_DIHAPUS.json` via Pterodactyl File Manager.
3. Set **Startup Command** to `node server.js`.

---

## 📡 API Endpoint Reference

All protected endpoints require your `API_KEY` sent via HTTP Header (`X-Api-Key: <key>`) or URL query (`?api_key=<key>`).

### 1. Check Session Token Health
- **Endpoint:** `GET /token-status`
- **Response:**
```json
{
  "success": true,
  "data": {
    "token_status": "valid",
    "message": "Token dan Sesi GoPay Merchant Aktif"
  }
}
```

### 2. Generate Dynamic QRIS
- **Endpoint:** `GET /create-qris?amount=25000&api_key=YOUR_KEY` or `POST /create-qris`
- **Response:**
```json
{
  "success": true,
  "data": {
    "qris_id": "9x8y7z6a",
    "trx_id": "TRX-MUTER88K",
    "qris_url": "http://your-domain.com/qr/9x8y7z6a",
    "qris_code": "00020101021226...",
    "amount": 25000,
    "expires_at": "2026-08-10T18:00:00.000Z",
    "expires_in": "5 menit"
  }
}
```

### 3. Interactive Web Checkout Interface
- **Endpoint:** `GET /qr/:id`
- **Description:** Renders dark UI for customer payment. Append `?format=raw` to fetch raw QR image.

### 4. Public QR Status Monitor (No API Key Required)
- **Endpoint:** `GET /api/qr-status/:id`
- **Description:** Safe endpoint for frontend payment verification without exposing `API_KEY`.

### 5. Server-to-Server Payment Verification
- **Endpoint:** `GET /check-payment?amount=25000&trx_id=TRX-MUTER88K`
- **Response:**
```json
{
  "success": true,
  "paid": true,
  "transaction": {
    "transaction_id": "12345678",
    "order_id": "GOPAY-998877",
    "amount": 25000,
    "payer_issuer": "GoPay / BCA",
    "payment_type": "QRIS",
    "transaction_time": "2026-08-10T17:55:00.000Z"
  }
}
```

### 6. Transaction History Mutation
- **Endpoint:** `GET /transactions`
- **Query Params:** `startTime` (unix), `endTime` (unix), `pageSize` (default 20).

### 7. Internal System Activity Logs
- **Endpoint:** `GET /api/logs`

---

## 🔒 Legal & Disclaimer

**Muter Engine** is an independent payment gateway project by **duacincin.id**. It is not affiliated, endorsed, or associated with PT GoTo Gojek Tokopedia Tbk or GoPay. Use responsibly adhering to merchant service terms.

---

<p align="center">
  <b>Muter Gateway</b> &bull; Credit & Powered by <a href="https://duacincin.id">duacincin.id</a>
</p>
