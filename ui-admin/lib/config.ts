export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-admin-prod.com/api' // TODO: Replace with your actual admin production API URL
  : 'http://127.0.0.1:3002/api';
