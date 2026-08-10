# 🏷️ Java Full Stack Online Price Tracker

A robust, full-stack web application built with Java, Spring Boot, and Thymeleaf designed to track product prices from e-commerce websites. The system automatically scrapes active URLs at scheduled intervals and displays live data on a clean dashboard.

---

## 🚀 Key Features

* **Automated Web Scraping:** Uses `Jsoup` to dynamically extract accurate real-time values using CSS selectors.
* **Smart Task Scheduling:** Leverages Spring `@Scheduled` cron automation to parse target web pages hourly.
* **Live Analytics Dashboard:** Interactive UI built with Bootstrap and Thymeleaf to instantly monitor cost changes.
* **Target Budget Alerts:** Automated threshold evaluation that flags items the moment price drops meet your goals.
* **Persistent Local Database:** Configured with an embedded H2 data layer for rapid onboarding and lightweight testing.

---

## 🛠️ Tech Stack & Dependencies

* **Backend Framework:** Spring Boot 3.x (Web, Data JPA)
* **View Template Engine:** Thymeleaf
* **Web Scraper Core:** Jsoup (Java HTML Parser)
* **Database Engine:** In-Memory H2 Database
* **UI Framework:** Bootstrap 5 (Responsive Layout CSS)
* **Build Architecture:** Maven

---

## 📦 Local Installation Guide

Follow these simple steps to download, compile, and initialize this architecture locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
* Java Development Kit (JDK 17 or higher)
* Apache Maven 3.x
* Git CLI

### 2. Clone the Repository
```bash
git clone https://github.com
cd price-tracker-java
```

### 3. Compile and Run Application
Execute the following Maven target inside your system terminal:
```bash
mvn spring-boot:run
```

### 4. Access the Live Dashboard
Open your local web browser application and clear routing paths toward:
`http://localhost:8080`

---

## 🖥️ Operational Guide

1. **Locate Target CSS Selector:** Navigate to your preferred e-commerce item window. Right-click the price tag text and choose **Inspect**. Identify its structural HTML token string class (e.g., `.price-tag-value` or `#item-price`).
2. **Register a Product Tracking Task:** Populate the UI submission fields with the Item Name, Product Page URL, extracted CSS Selector token, and your designated budget Target Price limit.
3. **Monitor Price Shifts:** The engine will instantly run its initial parse and register records inside your local tracked panel view. The background worker thread updates these fields continuously.

---

## 🤝 Project Contribution

Contributions make the open-source community an amazing place to learn, inspire, and create. 

1. Fork the Project Repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
