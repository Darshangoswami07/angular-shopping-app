// NG_APP_API_URL is injected at build/serve time by @ngx-env/builder from
// frontend/.env (or the host's build-time environment variables, which take
// priority over .env — e.g. a Vercel project's dashboard settings).
export const environment = {
  production: false,
  apiUrl: process.env['NG_APP_API_URL'] || 'http://localhost:3000/api',
};
