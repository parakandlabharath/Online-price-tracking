# Online Price Tracker

A Java full-stack web application for tracking product prices from e-commerce pages. Add a product URL and CSS selector to monitor its price, compare it with a target budget, and review tracked items from a browser dashboard.

## Features

- **Price extraction:** Uses Jsoup to read price information from product pages.
- **Scheduled checks:** Spring scheduling runs price checks automatically.
- **Budget monitoring:** Compare the latest price with a target price.
- **Web dashboard:** Thymeleaf and Bootstrap provide the user interface.
- **Local persistence:** Uses H2 with Spring Data JPA.

## Tech stack

| Area | Technology |
| --- | --- |
| Language | Java 17+ |
| Backend | Spring Boot |
| HTML parsing | Jsoup |
| Database | H2, Spring Data JPA |
| UI | Thymeleaf, Bootstrap |
| Build tool | Maven |

## Getting started

### Prerequisites

- JDK 17 or newer
- Git
- Maven, if the project does not include the Maven Wrapper

### 1. Clone the repository

```bash
git clone https://github.com/parakandlabharath/Online-price-tracking.git
cd Online-price-tracking
```

### 2. Run the application

If Maven is installed:

```bash
mvn spring-boot:run
```

If the repository includes the Maven Wrapper, you can use `./mvnw spring-boot:run` on macOS/Linux or `mvnw.cmd spring-boot:run` on Windows.

### 3. Open the dashboard

Visit [http://localhost:8080](http://localhost:8080) after the application starts.

## How to use

1. Open the dashboard.
2. Add a product name and product page URL.
3. Provide the CSS selector used to locate the price on that page.
4. Set a target price and save the product.
5. Review tracked prices and compare them with your target.

**Note:** E-commerce websites change their page structure and may restrict automated requests. A CSS selector that works on one page may not work on another.

## Project status

This project is intended for learning and demonstration. Verify the supported websites and current application behaviour before relying on its price data.

## Contributing

1. Fork this repository.
2. Create a branch: `git checkout -b feature/your-change`.
3. Commit your changes: `git commit -m "Add your change"`.
4. Push the branch and open a pull request.

## License

See the [LICENSE](LICENSE) file if included in this repository.
