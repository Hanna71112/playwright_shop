# E2E Automation Framework (Notebook store)

This project is an E2E test automation framework designed for testing the functionality of a notebook store web application. The framework is built using Playwright and integrates Allure for generating test reports.

---
**_Installation_**

To use this framework, make sure you have Node.js installed. You can download Node.js from the official website:
https://nodejs.org/en/

**_Steps to install_**

1. Clone the repository: git clone <your-repository-url>
2. Navigate to the root folder of the project
3. Install all dependencies with command: "npm install"
---

**_Authentication parameters_**

Create a .env file in the project's root folder. Add the following parameters to the file:
```
USERNAME=your_username
PASSWORD=your_password
```

**_Running tests_**

- npx playwright test

**_Generating Allure report_**

The framework integrates with Allure for generating test reports. Use the following commands to work with Allure:

1. npx allure generate ./allure-results --clean (to generate the HTML report)
2. allure open allure-report (to open generated report in browser)
 
**_Code formatting_**

Before committing changes, ensure your code is properly formatted using the following command:
- npm run format


**_Project structure_**
```
.
├── fixtures/              # Contains extended test setup with reusable components
├── src/
│   ├── pageObjects/       # Page Object Model (POM) classes for UI interactions
│   ├── utils/             # Utility modules and common helpers
├── tests/                 # Test files
├── .env                   # Environment variables with username and password
├── .prettierrc            # Prettier configuration for code formatting
├── playwright.config.ts   # Playwright configuration
├── allure-results/        # Test results for Allure
├── allure-report/         # Generated Allure report
└── README.md              # Project documentation
```

