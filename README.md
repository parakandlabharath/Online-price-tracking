<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Web Scraping Library -->
    <dependency>
        <groupId>org.jsoup</groupId>
        <artifactId>jsoup</artifactId>
        <version>1.17.2</version>
    </dependency>
</dependencies>

package com.tracker.model;

import jakarta.persistence.*;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String url;
    private String cssSelector; // HTML class/id where price is located
    private double currentPrice;
    private double targetPrice;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getCssSelector() { return cssSelector; }
    public void setCssSelector(String cssSelector) { this.cssSelector = cssSelector; }
    public double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }
    public double getTargetPrice() { return targetPrice; }
    public void setTargetPrice(double targetPrice) { this.targetPrice = targetPrice; }
}

package com.tracker.repository;

import com.tracker.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}

package com.tracker.service;

import com.tracker.model.Product;
import com.tracker.repository.ProductRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class PriceTrackerService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product saveProduct(Product product) {
        product.setCurrentPrice(scrapePrice(product.getUrl(), product.getCssSelector()));
        return productRepository.save(product);
    }

    // Runs automatically every hour to refresh prices
    @Scheduled(cron = "0 0 * * * *")
    public void trackAllPrices() {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            double latestPrice = scrapePrice(product.getUrl(), product.getCssSelector());
            if (latestPrice > 0) {
                product.setCurrentPrice(latestPrice);
                productRepository.save(product);
                
                if (latestPrice <= product.getTargetPrice()) {
                    System.out.println("ALERT: " + product.getName() + " reached price goal!");
                    // Trigger email alert logic here
                }
            }
        }
    }

    // Web scraping helper function
    private double scrapePrice(String url, String selector) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                    .timeout(5000)
                    .get();
            
            Element priceElement = doc.selectFirst(selector);
            if (priceElement != null) {
                String priceText = priceElement.text()
                        .replaceAll("[^0-9.]", ""); // Strips currency signs and commas
                return Double.parseDouble(priceText);
            }
        } catch (IOException | NumberFormatException e) {
            System.err.println("Scraping failed for URL: " + url + " - " + e.getMessage());
        }
        return 0.0;
    }
}


package com.tracker.controller;

import com.tracker.model.Product;
import com.tracker.service.PriceTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ProductController {

    @Autowired
    private PriceTrackerService trackerService;

    @GetMapping("/")
    public String index(Model model) {
        model.annotation("products", trackerService.getAllProducts());
        model.addAttribute("newProduct", new Product());
        return "index";
    }

    @PostMapping("/add-product")
    public String addProduct(Product product) {
        trackerService.saveProduct(product);
        return "redirect:/";
    }
}

<!DOCTYPE html>
<html xmlns:th="http://thymeleaf.org">
<head>
    <title>Java Price Tracker Dashboard</title>
    <link rel="stylesheet" href="https://jsdelivr.net">
</head>
<body class="bg-light container py-5">

    <h2 class="mb-4 text-center">🏷️ Java Full Stack Price Tracker</h2>

    <!-- Add Product Form Card -->
    <div class="card p-4 mb-5 shadow-sm">
        <h4>Track a New Item</h4>
        <form th:action="@{/add-product}" th:object="${newProduct}" method="POST" class="row g-3">
            <div class="col-md-3">
                <input type="text" th:field="*{name}" class="form-control" placeholder="Item Name (e.g. Laptop)" required>
            </div>
            <div class="col-md-4">
                <input type="url" th:field="*{url}" class="form-control" placeholder="E-commerce Product Link" required>
            </div>
            <div class="col-md-3">
                <input type="text" th:field="*{cssSelector}" class="form-control" placeholder="CSS Selector (e.g. .price)" required>
            </div>
            <div class="col-md-2">
                <input type="number" step="0.01" th:field="*{targetPrice}" class="form-control" placeholder="Target Price" required>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary w-100">Start Tracking</button>
            </div>
        </form>
    </div>

    <!-- Monitored Items Dashboard -->
    <div class="card p-4 shadow-sm">
        <h4>Tracked Products Dashboard</h4>
        <table class="table table-striped mt-3">
            <thead class="table-dark">
                <tr>
                    <th>Item Name</th>
                    <th>Current Value</th>
                    <th>Your Limit</th>
                    <th>Status</th>
                    <th>Store Page</th>
                </tr>
            </thead>
            <tbody>
                <tr th:each="product : ${products}">
                    <td th:text="${product.name}"></td>
                    <td th:text="'$' + ${product.currentPrice}"></td>
                    <td th:text="'$' + ${product.targetPrice}"></td>
                    <td>
                        <span th:if="${product.currentPrice <= product.targetPrice}" class="badge bg-success">Buy Now!</span>
                        <span th:if="${product.currentPrice > product.targetPrice}" class="badge bg-warning text-dark">Waiting...</span>
                    </td>
                    <td><a th:href="${product.url}" target="_blank" class="btn btn-sm btn-outline-secondary">Visit Shop</a></td>
                </tr>
            </tbody>
        </table>
    </div>

</body>
</html>
