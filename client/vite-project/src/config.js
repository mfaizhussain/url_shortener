/**
 * Shared config used across the app.
 * Short links open on the Express server (port 3000), not the Vite dev server.
 */
export const SHORT_URL_BASE = `${window.location.protocol}//${window.location.hostname}:3000`
