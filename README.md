# Online Price Tracker

A web application project focused on tracking product prices and comparing them with target prices. The project description and setup details should always match the current source code.

## Project goals

- Track products by their product-page URLs.
- Compare observed prices with a target price.
- Present tracked products in a simple dashboard.

## Technology

The current project README describes Java 17+, Spring Boot, Jsoup, Spring Data JPA, H2, Thymeleaf, Bootstrap, and Maven. Confirm these against the project configuration before relying on them.

## Getting started

1. Install the JDK and build tools required by the project.
2. Clone this repository:

```bash
git clone https://github.com/parakandlabharath/Online-price-tracking.git
cd Online-price-tracking
```

3. Check that the repository contains a Maven `pom.xml`. If it does, run:

```bash
mvn spring-boot:run
```

4. If the application starts successfully, open the local URL printed by Spring Boot (commonly `http://localhost:8080`).

## Screenshots

Add genuine screenshots of the running application in a `screenshots/` folder, then link them here. Capture the actual interface rather than using mockups.

## Before release

- [ ] Verify setup on a fresh clone.
- [ ] Confirm which websites and price selectors are supported.
- [ ] Document configuration and error handling.
- [ ] Add tests and screenshots.
- [ ] Check that no credentials or API keys are committed.

## Notes

E-commerce page structure and access rules can change. Automated requests may fail or be restricted by some websites.

## Contributing

Create a feature branch, make a focused change, and open a pull request with a clear description.
