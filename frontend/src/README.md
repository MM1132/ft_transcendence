# Frontend Svelte App Structure

This document explains the structure and organization of our Svelte frontend application.

## Overview

This is a Svelte 5 application built with Vite as the build tool. The app follows a component-based architecture with a clear separation of concerns.

## Tech Stack

- **Svelte 5** - UI framework
- **Vite** - Build tool and dev server
- **JavaScript** - Primary language

## Project Structure

```
frontend/
├── public/              # Static assets (served as-is)
├── src/
│   ├── main.js         # Application entry point
│   ├── App.svelte      # Root component (application shell)
│   ├── app.css         # Global styles (currently unused)
│   ├── style.css       # Global styles (active)
│   ├── components/     # Reusable UI components
│   │   ├── button.svelte
│   │   ├── input.svelte
│   │   └── loginForm.svelte
│   ├── pages/          # Page-level components
│   │   └── loginPage.svelte
│   └── images/         # Image assets
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── svelte.config.js    # Svelte configuration
└── jsconfig.json       # JavaScript configuration
```

## Key Files

### `main.js`
The application entry point that mounts the root `App.svelte` component to the DOM.

### `App.svelte`
The application shell responsible for:
- Routing/Navigation - Determining which page to display
- Global Layout - Elements that appear across all pages
- Authentication Flow - Handling login vs authenticated states
- Global State - Managing authentication status and other app-wide state

### `components/`
Reusable UI components that can be used across multiple pages:
- `button.svelte` - Styled button component
- `input.svelte` - Form input component
- `loginForm.svelte` - Login form with validation

### `pages/`
Page-level components that represent different views/routes:
- `loginPage.svelte` - Login page view

## Development

### Running the App
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Adding New Components
1. Create a new `.svelte` file in `src/components/`
2. Use PascalCase for component filenames (e.g., `MyComponent.svelte`)
3. Import and use in pages or other components

### Adding New Pages
1. Create a new `.svelte` file in `src/pages/`
2. Import and route to it from `App.svelte`

## Coding Conventions

- Use **camelCase** for JavaScript variables and functions
- Use **PascalCase** for component names
- Keep components small and focused on a single responsibility
- Place reusable logic in separate utility files
- Use props for component communication
- Store shared state in Svelte stores (to be implemented)

## Current Status

The app currently displays a login page. Future implementations will include:
- Client-side routing
- Global state management
- Additional pages (dashboard, profile, etc.)
- Authentication integration with backend
- Protected routes

## Resources

- [Svelte Documentation](https://svelte.dev/docs)
- [Vite Documentation](https://vitejs.dev/)
- Backend API: See `backend/README.md`
