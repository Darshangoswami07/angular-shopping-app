interface RuntimeEnvironmentWindow extends Window { __env?: { API_BASE_URL?: string } }
const runtimeWindow = typeof window === 'undefined' ? undefined : window as RuntimeEnvironmentWindow;

export const environment = {
  production: false,
  apiUrl: runtimeWindow?.__env?.API_BASE_URL || 'http://localhost:3000/api',
};
