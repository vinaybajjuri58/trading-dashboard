// Dev  (.env):            VITE_API_BASE=http://localhost:8000
// Prod (.env.production): VITE_API_BASE=   ← empty → relative URLs, Nginx proxies /api/
export const API_BASE: string = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';
