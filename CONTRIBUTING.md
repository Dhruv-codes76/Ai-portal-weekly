# 🤝 Contributing to Ai-tools

Thanks for your interest in contributing! This project is about building realism around AI — cutting through the hype.

---

## 📋 Before You Start

- Read the [README.md](./README.md) to understand the project.
- Check open issues before creating new ones.
- For significant changes, open an issue first to discuss your approach.

---

## 🔧 How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/Dhruv-codes76/Ai-portal-weekly.git
cd Ai-portal-weekly
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/your-bug-name
```

### 3. Set Up Locally

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, etc.
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Make Your Changes
- Follow the **Enterprise N-Tier Architecture** (see README for details).
- New API endpoints must have: Route → Validation Schema → Controller → Service.
- Keep controllers thin — business logic belongs in Services.

### 5. Commit
We use conventional commits:
```
feat: add search filtering by category
fix: correct slug generation for special characters
docs: update API table in README
refactor: extract tool image logic into imageService
```

### 6. Open a Pull Request
- Describe **what** you changed and **why**.
- Reference any related issue (e.g. `Closes #42`).
- Make sure the app starts without errors (`npm run dev`).

---

## 📐 Code Standards

| Rule | Detail |
|---|---|
| **Architecture** | N-Tier: Route → Validation → Controller → Service |
| **Validation** | All write endpoints must use a Zod schema |
| **Error Handling** | Throw `AppError` from services, never `res.status()` in services |
| **Database** | All Prisma queries live in `services/` only |
| **Naming** | `camelCase` for variables, `PascalCase` for classes/services |

---

## 🐛 Reporting Bugs

Please include:
- Steps to reproduce
- Expected vs actual behavior
- Node.js version and OS

---

## 👥 Current Contributors

| Name | Role |
|---|---|
| [Dhruv](https://github.com/Dhruv-codes76) | Co-Developer |
| [Aman](https://github.com/AmanRcool) | Co-Developer |
| [Rivatrt](https://github.com/rivatrt) | Co-Developer |

*Want to see your name here? Submit a PR!*
