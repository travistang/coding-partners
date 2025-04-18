# Coding Partners - Habit Tracker

A simple habit tracking application built with React and Express, demonstrating clean architecture and modern web development practices.

## Setup & Running

### Prerequisites

- Node.js 18+
- npm 9+

### Development

1. Clone the repository:

```bash
git clone <repository-url>
cd coding-partners
```

2. Install dependencies:

```bash
npm install
```

3. Start development servers:

```bash
npm run dev
```

This will start:

- Frontend at http://localhost:5173
- Backend at http://localhost:3000

### Production Build

1. Build both frontend and backend:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

The application will be available at http://localhost:3000

## Implementation Status

### ✅ Completed Features

#### Frontend

- [x] Create new habits with name and description
- [x] Tailwind and Vanilla CSS (button is styled with vanilla CSS defined in `index.css`, with `button.primary` elements having different styles)
- [x] View all habits
- [x] Mark habits as complete/incomplete for today
- [x] Delete habits
- [x] React Hooks usage (useState, useEffect)
- [x] Tailwind CSS styling
- [x] API integration using Fetch
- [x] Loading states for async operations

#### Backend

- [x] REST API endpoints implementation
  - GET /habits
  - POST /habits
  - PATCH /habits/:id/toggle
  - DELETE /habits/:id
- [x] Async/await usage
- [x] Clean architecture with routes and repositories
- [x] Date-based habit completion tracking
- [x] Repository pattern implementation
  - InMemoryHabitRepository
  - FileHabitRepository
- [x] Environment variable based repository selection

### 🚧 Skipped/Incomplete Features

#### Backend

- [ ] Input validation
- [ ] Error handling middleware
- [ ] Logging

## Architecture

### Repository Pattern

The application implements the Repository pattern with two storage implementations:

1. **InMemoryHabitRepository**: Stores data in memory (default)
2. **FileHabitRepository**: Persists data to JSON files

Switch between implementations using the environment variable:

```bash
USE_FILE_REPOSITORY=1 npm start
```

## Project Structure

```
coding-partners/
├── app/                 # Frontend React application
├── backend/            # Express backend
│   ├── src/
│   │   ├── features/
│   │   │   └── habits/
│   │   │       ├── repository/
│   │   │       ├── types/
│   │   │       └── router.ts
│   │   └── index.ts
│   └── public/         # Built frontend files
└── package.json        # Root workspace configuration
```

## Technology Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Build Tools: npm workspaces
