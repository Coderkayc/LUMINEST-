# ⚡ LUMINEST AFRICA Backend

LUMINEST AFRICA is a technology platform designed to provide African households—starting with Nigeria—clear visibility, control, and smarter management of their electricity usage. This repository contains the core API and IoT ingestion engine..

## 🚀 Project Overview
The backend is built to handle high-frequency energy data from smart meters using a combination of RESTful APIs for user interaction and MQTT for hardware communication.

### Key Features
* **Real-time Monitoring:** Ingests live voltage, current, and wattage data from smart meters.
* **Smart Billing:** Automated deduction of credit based on NERC tariff bands (A, B, C, D, E).
* **Remote Control:** "Kill-switch" functionality to disconnect/reconnect power based on balance or user command.
* **Secure Payments:** Integrated with Paystack for automated wallet top-ups via webhooks.
* **Time-Series Analytics:** Optimized storage for historical usage data using MongoDB Time-Series collections.

## 🛠 Tech Stack
* **Runtime:** Node.js (v22+)
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Communication:** MQTT (for IoT/Hardware)
* **Authentication:** JWT & Bcrypt.js
* **Payments:** Paystack API

## 📁 Project Structure
```text
src/
├── config/             # Database and MQTT configurations
├── controllers/        # Request handlers (Auth, Meter, Control, Usage)
├── middleware/         # Auth protection and global error handling
├── models/             # Mongoose schemas (User, Meter, Usage)
├── routes/             # API endpoint definitions
├── services/           # Business logic (Billing, MQTT listeners)
├── utils/              # Helper functions (Calculations)
└── app.js              # Express app setup


### Tips for your README:
* **Visuals:** Once you have the mobile app screenshots, you can add an `assets` folder and include images to make the README more engaging for investors.
* **Postman Collection:** It is very helpful to export your Postman collection and include the JSON file in a `docs/` folder so other team members can test the API instantly.

**Would you like me to help you create a sample JSON file for a Postman collection to test these endpoints?**

Contributor
Backend Lead: Coderkayc

The LUMINEST Team

© 2026 LUMINEST AFRICA. All Rights Reserved.
