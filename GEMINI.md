# GEMINI.md

## Project Overview

This is a modern Todo App for task management, built with a rich and powerful technology stack. The application is designed to be fast, reliable, and user-friendly, with a focus on offline-first functionality and a clean, adaptive user interface.

- **Frontend:** React 18, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Database:** IndexedDB for local storage in the browser
- **Date Management:** date-fns
- **Icons:** lucide-react

The application allows users to create, view, edit, and delete tasks. Tasks have a title, description, deadline, priority, and category. Users can filter tasks by status and priority, and search for tasks by text. The application also provides task statistics.

## Building and Running

### Prerequisites

- Node.js and npm installed

### Installation

To install the dependencies, run the following command:

```bash
npm install
```

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

The production files will be generated in the `dist` directory.

### Linting

To lint the codebase, run:

```bash
npm run lint
```

## Development Conventions

### Code Style

The project uses ESLint to enforce a consistent code style. The ESLint configuration can be found in the `.eslintrc.cjs` file.

### Testing

The project does not currently have a testing framework configured.

### Contribution Guidelines

There are no formal contribution guidelines at the moment.
