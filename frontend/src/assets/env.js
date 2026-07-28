// Runtime configuration, loaded before the Angular bundle. This lets a single
// built artifact be pointed at a different backend per deployment (e.g. a
// Render service URL on Vercel) WITHOUT rebuilding — edit API_BASE_URL below
// (or replace this file post-build) and redeploy just this static asset.
//
// Leave API_BASE_URL empty to use the build's default (see
// src/environments/environment.ts / environment.prod.ts).
window.__env = {
  API_BASE_URL: '',
};
