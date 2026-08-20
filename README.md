# Sentimental Souvenirz — Custom Engineering Features

> **Live Store:** [sentimentalsouvenirz.store](https://sentimentalsouvenirz.store)  
> **Type:** Direct-to-Consumer (D2C) E-Commerce  
> **Tech Stack:** PHP 8, WooCommerce Hooks & Filters, Vanilla JavaScript (ES6+), CSS Grid & Custom Properties, Polylang i18n API, REST APIs (GeoJS)

---

## 📌 Project Overview

**Sentimental Souvenirz** is an e-commerce platform offering personalized, breed-specific 3D-printed pet memorial urns crafted in Tallinn, Estonia. 

Rather than relying on bloated page builders (Elementor/Divi), this custom child theme was engineered from the ground up on top of Storefront. It delivers an ultra-fast, high-converting, Etsy-inspired shopping experience with custom asynchronous frontend features and complex multi-currency backend cart mathematics.

---

## 🚀 Key Engineering Highlights

### 1. Dynamic Geo-Shipping Estimates (Zero-Latency)
* **File:** [`Sentimental-Souvenirz-Features/dynamic-geo-shipping.php`](./Sentimental-Souvenirz-Features/dynamic-geo-shipping.php)
* **The Problem:** Standard WooCommerce shipping calculators require customers to proceed to checkout and enter their full address before seeing delivery dates, leading to high cart abandonment.
* **The Solution:** Implemented a lightweight, non-blocking plaintext IP lookup via the GeoJS API to detect whether the user is located in the EU or internationally. A custom Vanilla JS algorithm calculates upcoming delivery windows using dynamic business-day math (skipping weekends) and updates the product page UI instantly on load while bypassing page cache.

---

### 2. Multi-Currency Cart Math & Add-On Fees
* **File:** [`Sentimental-Souvenirz-Features/custom-woo-currency-fees.php`](./Sentimental-Souvenirz-Features/custom-woo-currency-fees.php)
* **The Problem:** Adding custom line-item fees (e.g., an Expedited Production add-on) via standard WooCommerce `add_fee()` hooks causes pricing mismatch errors in multi-currency environments (e.g., charging a flat $100 instead of converting the base €100 amount to active USD/GBP rates).
* **The Solution:** Engineered `ss_to_active_currency()`, a resilient conversion wrapper that hooks into the WooPayments Multi-Currency engine to fetch live exchange rates, scale dynamically by expedited item quantities, and safely persist metadata through cart calculation, checkout, and order creation.

---

### 3. Etsy-Style 2-Column Product Page Architecture
* **File:** Custom PHP Hooks & CSS Grid Rebuild
* **The Problem:** Native WooCommerce product templates force user reviews and detailed descriptions below the fold into clumsy tabs, depressing conversion rates.
* **The Solution:** Disassembled and re-hooked core WooCommerce summary components into an Etsy-inspired layout:
  * **Left Column:** Sticky vertical thumbnail carousel + customer reviews directly underneath.
  * **Right Column:** Product titles, live pricing, breed customization dropdowns, trust badges, and long descriptions.
  * **Mobile:** Automatically collapses via `IntersectionObserver` to reveal a sticky bottom "Add to Cart" bar when scrolled past the main CTA.

---

### 4. Performance-Focused Video Autoplay (IntersectionObserver)
* **File:** [`Sentimental-Souvenirz-Features/video-scroll-autoplay.js`](./Sentimental-Souvenirz-Features/video-scroll-autoplay.js)
* **The Problem:** Embedding animated 3D-printing process videos on multiple product cards severely impacts mobile performance, memory usage, and battery life if allowed to play simultaneously.
* **The Solution:** Built a custom viewport manager using `IntersectionObserver` and `requestAnimationFrame`. On desktop, video previews play smoothly on hover. On mobile devices (`hover: none`), the script tracks scroll velocity and viewport position to dynamically play only the video closest to the vertical center of the screen while freezing all others.

---

### 5. Native Live Price Calculator
* **File:** [`Sentimental-Souvenirz-Features/live-price-update.js`](./Sentimental-Souvenirz-Features/live-price-update.js)
* **The Problem:** Selecting product variations, adjusting quantities, or checking add-on options causes delayed price recalculations or requires server roundtrips.
* **The Solution:** Wrote a self-contained DOM manipulation script that formats currency strings according to active locale separators and instantly recalculates totals in the main price block and mobile sticky bar in real time.
