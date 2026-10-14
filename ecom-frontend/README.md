# E-Commerce Frontend (React + TypeScript)

Single-page application for the Spring Boot e-commerce API. See the [main README](../README.md) for the full project.

**Stack:** React 19 · TypeScript · Vite · React Router · TanStack Query · Tailwind CSS · Nginx (Docker)

```bash
npm install
npm run dev      # http://localhost:5173 — /api is proxied to http://localhost:8080
npm run build    # type-check + production build into dist/
npm run lint
```

To point the dev server at a backend running from the IDE (port 8081), create `.env.local`:

```
API_PROXY_TARGET=http://localhost:8081
```
