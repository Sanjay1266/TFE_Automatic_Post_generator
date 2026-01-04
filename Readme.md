# QR → Social Post Launcher

Scan a single **QR code** to open a minimal landing page that dynamically loads platform-specific post content (from JSON files) and helps users share a Tech Fest or event post on **LinkedIn, Twitter (X), or Instagram** with one click.

This project is designed to be **mobile-first**, **lightweight**, and **policy-compliant**, providing the maximum automation allowed by social media platforms.

---

## 📘 Project Overview

The QR → Social Post Launcher is a client-side web application used for **event and Tech Fest promotion**.  
Instead of manually writing posts, users scan a QR code, select a platform, and are redirected to the appropriate **app or browser share interface** with the post content already prepared.

The system separates **content** from **logic**, allowing easy updates to post text using JSON files without modifying the code.

---

## 🎯 Objectives

- Enable quick social media sharing using a QR code
- Reduce user effort in writing promotional posts
- Ensure consistent and professional messaging
- Optimize the experience for mobile users
- Avoid backend servers and authentication
- Fully comply with LinkedIn, Twitter, and Instagram policies

---

## 🔄 Flow Overview

QR Code  
↓  
Landing Web Page (`index.html`)  
↓  
JavaScript Controller (`script.js`)  
↓  
Dynamic Content Fetch (`content/*.json`)  
↓  
Platform-Specific Redirection  
↓  
User Confirms & Publishes Post

---

## 🏗️ System Architecture

The system follows a **pure client-side architecture**.


---

## ✨ Features

- Mobile-first black & white landing UI
- Clean, minimal, QR-friendly design
- Platform buttons for:
  - LinkedIn
  - Twitter (X)
  - Instagram
- Post text loaded dynamically from JSON files
- Pre-filled share URLs where supported
- App or browser redirection based on platform and device
- No alerts, no popups, no backend

---

## 📂 Project Structure

```text
project/
│
├── index.html       → Landing page UI
├── style.css        → Mobile-first black & white theme
├── script.js        → Sharing logic and platform handling
│
└── content/
    ├── linkedin.json   → LinkedIn post content
    ├── twitter.json    → Twitter (X) post content
    └── instagram.json  → Instagram caption content

---


