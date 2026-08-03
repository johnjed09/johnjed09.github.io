# Personal Portfolio — John Jedidiah Getes

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![SCSS](https://img.shields.io/badge/SCSS-HotPink?style=for-the-badge&logo=sass&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v24.14.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

> A lightweight, custom-built web portfolio designed to showcase software engineering projects with zero framework overhead and maximum control over UI/UX performance.

---

## 📌 Overview

This repository houses the source code for my personal portfolio. Built completely from scratch without heavy client-side frameworks, the goal was to create a blazing-fast, responsive single-page experience that highlights my technical projects, software design decisions, and engineering background.

- **Live Site:** [johnjed09.github.io](https://johnjed09.github.io)
- **Primary Color Scheme:** Custom White/Orange Theme

---

## ⚡ Technical Architecture & Trade-offs

| Engineering Focus  | Choice                | Trade-off & Justification                                                                                                                                                             |
| :----------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Logic Layer**    | **Vanilla JS (ES6+)** | Chose framework-free JavaScript to eliminate runtime library overhead, reduce bundle sizes, and maintain direct control over DOM manipulation and event handlers.                     |
| **Styling Layer**  | **SCSS (Sass)**       | Implemented a modular SCSS architecture using custom mixins for screen breakpoints and event handling (hover/focus states), alongside CSS custom properties for global design tokens. |
| **Asset Strategy** | **Local Bundling**    | Opted for local asset management over third-party Cloud CDNs to eliminate external load dependencies, optimize asset fetching, and keep hosting costs at zero via GitHub Pages.       |

---

## 📁 Repository Structure

```text
├── index.html                        # Main DOM entry point & semantic markup
├── package.json                      # Scripts, dev dependencies, and build pipelines
└── src/
    ├── main.js                       # Core application logic & DOM interaction
    └── stylesheets/
        ├── abstracts/
        │   ├── _variables.scss       # Global theme tokens (Colors, Breakpoints)
        │   └── _mixins.scss          # Responsive queries & event state mixins
        ├── base/
        │   └── _fonts.scss           # Font declarations
        └── pages/                    # Page-specific modular styles
            ├── _welcome.scss
            ├── _profile.scss
            ├── _projects.scss
            └── _contact-me.scss
```

---

## 🛠️ Local Development & Setup

Follow these steps to run and test the repository on your local machine.

### Prerequisites

Ensure you have the following installed on your environment:

- **Node.js:** `v24.14.0` or higher
- **npm:** `v11.9.0` or higher
- **Recommended Editor:** [VS Code](https://code.visualstudio.com/) with the **Prettier** extension installed.

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone git@github.com:johnjed09/johnjed09.github.io.git
   cd johnjed09.github.io
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Launch local development server:**
   ```bash
   npm run dev
   ```

---

## 🎨 Code Style & Formatting

To maintain consistent formatting across all style and script files:

1. Install the **Prettier - Code formatter** extension in VS Code.
2. Set Prettier as your default formatter in your workspace settings:
   ```json
   "editor.defaultFormatter": "esbenp.prettier-vscode",
   "editor.formatOnSave": true
   ```
