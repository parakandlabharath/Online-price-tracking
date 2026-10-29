# Online Price Tracker

<p align="center">
  <img src="https://img.shields.io/badge/Java-Backend-orange?logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-Framework-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Price-Tracking-blue" alt="Price tracking" />
  <img src="https://img.shields.io/badge/Status-Documentation%20Stage-lightgrey" alt="Documentation stage" />
</p>

A web application concept for monitoring product prices, comparing them with target prices, and viewing tracked items in one place.

## 🎯 Project goals

- Track products using their product-page URLs.
- Compare observed prices against user-defined target prices.
- Present tracked items in a clear dashboard.
- Make price changes easier to review.

## 🧰 Technology

The project has previously been described with the following stack. Verify each item against the source and build configuration before treating it as final:

- Java 17+
- Spring Boot
- Jsoup
- Spring Data JPA
- H2 Database
- Thymeleaf and Bootstrap
- Maven

## 🚀 Run locally

The repository currently contains project documentation only; application source and build files are not present on the default branch, so a verified run command cannot yet be provided.

When the source is added, document the exact setup here, including:

1. Required JDK and build tool versions.
2. Database and application configuration.
3. Commands to build and start the application.
4. The local URL and any required environment variables.

## 🖼️ Screenshots

Add screenshots captured from the actual running application in a `screenshots/` directory and link them here.

## 🗺️ Roadmap

- [ ] Add application source and build configuration.
- [ ] Document supported product sites and price extraction behavior.
- [ ] Handle unavailable pages, changed page layouts, and request failures.
- [ ] Add automated tests.
- [ ] Add genuine screenshots and verified setup instructions.
- [ ] Confirm that secrets and personal credentials are not committed.

## Notes

Product pages can change their structure or restrict automated requests. Price extraction should handle such failures gracefully and respect each website's terms and access rules.

## 🤝 Contributing

Use a focused branch, make a clearly scoped change, and describe how it was tested in the pull request.
