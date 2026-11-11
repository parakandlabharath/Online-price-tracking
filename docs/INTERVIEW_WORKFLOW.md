# Online Price Tracker — Interview Workflow

> **Documentation status:** This describes the intended application flow based on the current project README. The default branch currently contains documentation rather than application source, so do not describe these steps as implemented or tested until the code is added and verified.

## 1. Problem the project addresses

The application is intended to help a user monitor a product's price over time and compare the observed price with a target price.

## 2. Main user workflow

1. The user opens the application and, if authentication is implemented, signs in.
2. The user submits a product-page URL and optionally enters a target price.
3. The backend validates the URL and checks whether the product can be tracked.
4. A price-fetching component requests the product page and extracts relevant product details, such as the name and displayed price.
5. The application stores the product information and the observed price with a timestamp.
6. On later checks, it records new observations so the user can review price history.
7. The dashboard presents tracked products, latest observed prices, and changes against previous observations or the target price.

## 3. Intended component flow

`Browser / Thymeleaf UI → Spring Boot Controller → Service Layer → Price Fetcher (Jsoup) → Repository → Database`

- **UI:** Thymeleaf and Bootstrap are listed in the project README as the intended presentation technologies.
- **Controller:** receives the submitted product URL and returns a page or response.
- **Service:** validates input and coordinates price tracking.
- **Price fetcher:** Jsoup is the previously documented choice for extracting page information; confirm supported sites and selectors in source code.
- **Repository / database:** Spring Data JPA and H2 are listed in the README; verify the actual entities and configuration when source is available.

## 4. Example data to explain

- Product: name, product URL, website/source.
- Price observation: product reference, observed price, observation time.
- Target price: user-defined threshold, if this feature is implemented.

## 5. Important edge cases

- Invalid or unsupported product URL.
- Product page unavailable or request blocked.
- Price missing or page layout changed.
- Price value cannot be parsed.
- Duplicate product URL.
- Database or network failure.

The application should show a useful error and avoid saving invalid price observations.

## 6. One-minute interview explanation

“My project is an Online Price Tracker intended to help users monitor product prices. A user submits a product-page URL, the backend validates it, and a price-fetching component extracts product details and the displayed price. The application stores product information and timestamped price observations so users can review changes through a dashboard. The README lists Java, Spring Boot, Jsoup, Spring Data JPA, H2, Thymeleaf and Bootstrap as the intended stack. I would explain the exact implemented features after verifying them against the source code.”

## 7. Be ready for these questions

1. Why did you choose Jsoup?
2. How do you handle a website changing its HTML structure?
3. How do you store price history?
4. How would you schedule repeated price checks?
5. How do you avoid duplicate products?
6. What happens if a product page cannot be accessed?

## 8. Current repository status

The default branch currently has project documentation but no application source or build configuration. Treat the workflow above as a design explanation, not proof of a completed implementation.