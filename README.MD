# Referral Management Monorepo Guide

This monorepo contains **backend** and **frontend** applications for managing referrals.

* **Backend:** Node.js + SQLite API
* **Frontend:** React + TypeScript + Tailwind CSS + Redux Toolkit

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Frontend Setup](#frontend-setup)
3. [Backend Setup](#backend-setup)
4. [Tech Choices & Architecture](#tech-choices--architecture)
5. [Testing](#testing)

---

## Project Structure

Using **Turbo repo + workspaces**:

```
repo-root/
├─ apps/
│  ├─ referral-app-ui/       # React frontend
│  └─ referral-api/          # Node.js backend
├─ turbo.json               # Turborepo config
└─ package.json             # Monorepo root
```

**Feature-based architecture** (frontend):

```
src/
├─ api/              # middleware and services
├─ components/       # Reusable UI components (common, dumb components)
├─ pages/            # Main Page Content
├─ presentation/     # Feature modules, e.g., referral
│  ├─ ReferralForm/
│  ├─ ReferralList/
│  └─ modals/
├─ store/            # Redux Toolkit slices & hooks
└─ types/            # Reusable types for object mapping
```

---

## Frontend Setup

1. Install dependencies:

```bash
cd apps/referral-app-ui
npm install
```

2. Copy `.env.example` and update if necessary:

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm run dev
# Runs at http://localhost:5173
```

**Key features:**

* **Tailwind CSS** → fast, responsive styling
* **Redux Toolkit** → standardized state management for referrals
* **Feature-based structure** → easier maintenance and scalability
* **React Query / React Hooks** → handle async API calls with `useGetReferrals`, `useCreateReferral`, etc.

---

## Backend Setup

1. Install dependencies:

```bash
cd apps/referral-api
npm install
```

2. Copy `.env.example` and customize:

```bash
cp .env.example .env
```

3. Initialize database with schema + sample data:

```bash
npm run seed
```

4. Start the server:

```bash
npm run dev    # or npm start
```

**Default API URL:** `http://localhost:4000`
**Auth:** `Authorization: Bearer ${API_TOKEN}` (default: `dev-token`)

### API Endpoints (CRUD)

| Method | Route           | Description                        |
| ------ | --------------- | ---------------------------------- |
| GET    | /referrals      | List referrals (filter/pagination) |
| POST   | /referrals      | Create new referral                |
| GET    | /referrals/\:id | Get single referral by ID          |
| PATCH  | /referrals/\:id | Update referral (partial)          |
| DELETE | /referrals/\:id | Delete referral                    |

---

## Tech Choices & Architecture

### Redux Toolkit (State Management)

* Simplifies slice creation, async thunks, and immutable updates
* Reduces boilerplate
* Handles async status (`isLoading`, `isError`) out-of-the-box
 

### Tailwind CSS

* Rapid, responsive, and consistent styling
* Lowers CSS complexity
* Works well with component-driven React structure

### Feature-based Architecture

* Group files by feature, not type
* Each feature has:

  * Components
  * Store slices / hooks
  * Tests
* Benefits: easier scaling, feature isolation, clearer ownership

---

## Testing

**Frontend (React + Jest + RTL)**

```bash
npm test               # Run all tests
npm test -- --watch    # Watch mode
npm test -- --coverage # Coverage
```

**Backend (Node.js + Jest + Supertest)**

* Tests cover:

  * CRUD operations
  * Validation
  * Authentication
  * Edge cases

---

## Notes / Tips

* Backend SQLite file: `data.sqlite` at repo root
* Re-run `npm run seed` to reset sample data
* All timestamps are auto-managed (`createdAt`, `updatedAt`)
* Frontend interceptors attach Bearer token automatically
* Pagination and filtering supported via query params

---

This file serves as a **single source of truth** for both frontend and backend setup, structure
