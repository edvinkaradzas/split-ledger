# JavaScript CLI Template

Welcome to the **1dv610** JavaScript Command-Line Interface (CLI) template. This repository serves as a clean, pre-configured boilerplate for building robust Node.js console applications with modern tools and best practices.

## 🚀 Features

- **Modern ECMAScript Modules (ESM):** Full native support for `import`/`export` syntax.
- **Unit Testing:** Pre-configured with [Vitest](https://vitest.dev) for blazing-fast test execution.
- **Linting & Code Quality:** Strict code analysis using [ESLint](https://eslint.org) integrated with custom `@lnu/eslint-config` rules.
- **Code Formatting:** Automatic code style management via [Prettier](https://prettier.io).

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have **Node.js** (version 24.12.0 or later) and **Git** installed on your machine.

### Installation & Project Setup

Pick the flow that matches your situation.

#### A. Starting from scratch (no repository yet) — recommended

Use GitHub's built-in template flow — no git commands needed to get a clean, single-commit history:

1. On GitHub, open this template repository and click **Use this template → Create a new repository**.
2. Clone your new repository and move into it:

   ```bash
   git clone <your-newly-created-repository-url>
   cd <your-repository-name>
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

GitHub gives your new repository its own single commit copied from this template — no shared history, nothing to merge or squash.

> **Note:** This requires the template repository to have **Template repository** enabled under its GitHub Settings → General. If the "Use this template" button isn't available, use flow B instead.

#### B. Importing into an existing repository (empty or not)

Use this flow if you already have a repository — e.g. one provisioned by GitHub Classroom — that you can't or don't want to recreate from a template.

1. Clone your existing repository and move into it:

   ```bash
   git clone <your-existing-repository-url>
   cd <your-repository-name>
   ```

2. If the repository has no commits yet, create an empty initial commit:

   ```bash
   git commit --allow-empty -m "Initial commit"
   ```

   _Note: This step is required for a genuinely empty repository. A branch with zero commits has nothing for `--squash` to diff against, so `git pull --squash` silently falls back to a plain fast-forward — it imports this template's entire internal commit history unmodified instead of collapsing it into one clean commit. An empty commit gives `--squash` a (empty) tree to compare against, so it behaves as intended. Skip this step if the repository already has commits (e.g. an auto-generated README)._

3. **Pull and squash the boilerplate code** from this template repository into your branch:

   ```bash
   git pull git@github.com:1dv610/js-cli-template.git main --squash --allow-unrelated-histories
   ```

   _Note: Using `--squash` ensures that the boilerplate's internal development history is collapsed into a single, clean starting point in your repository. If your repository already had files (e.g. GitHub auto-created a README or `.gitignore`), this will report a conflict on those files — resolve it by taking the template's version: `git checkout --theirs <file> && git add <file>`._

4. **Commit the imported files** to finalize the import of the boilerplate:

   ```bash
   git commit -m "Initial commit from boilerplate"
   ```

5. **Install the project dependencies:**

   ```bash
   npm install
   ```

6. **Push the clean boilerplate setup** up to your own GitHub repository:
   ```bash
   git push origin main
   ```

---

## 💻 Available Scripts

You can manage the application lifecycle, testing, and formatting using the following npm scripts:

### Running the Application

Starts the main console application entry point (`src/app.js`), optionally passing a name as the first argument:

```bash
npm start
npm start -- "Ada Lovelace"
```

The `bin` entry in `package.json` also makes the app runnable as a standalone command once linked (`npm link`) or installed:

```bash
js-cli-template "Ada Lovelace"
```

_Note: Rename the `js-cli-template` key in `package.json`'s `bin` field (and the `name` field) to match your own project when adapting this template._

### Running Tests

- **Interactive Watch Mode (Recommended for development):**
  ```bash
  npm test
  ```
- **Single Execution Run:**
  ```bash
  npm run test:run
  ```
- **Run Specific Tests (by matching name patterns):**
  ```bash
  npm run test:match -- <test-name-pattern>
  ```

### Code Linting

Analyze the source code in `src/` for errors, syntax issues, and anti-patterns:

```bash
npm run lint
```

Automatically fix fixable linting issues:

```bash
npm run lint:fix
```

### Formatting

Check if files comply with Prettier styling rules:

```bash
npm run format:check
```

Automatically reformat all source files:

```bash
npm run format
```

---

## 📁 Project Structure

```text
├── src/
│   ├── app.js       # Main application logic & execution entry point
│   └── app.test.js  # Unit tests for closely coupled application logic
├── test/            # Integration and system tests (higher-level / E2E test flows)
├── package.json     # Project configuration, scripts, and dependencies
└── LICENSE          # Unlicense (Public Domain dedication)
```

---

## ⚖️ License

This project is released into the public domain under the **Unlicense**. You are free to copy, modify, publish, and distribute this boilerplate code in any way you see fit without any restrictions.
