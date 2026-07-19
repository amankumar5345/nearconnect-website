import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';

import './index.css';

// In production (Vercel), point the API client at the deployed backend.
// Set VITE_API_URL in your Vercel project environment variables.
// In dev (Replit) no base URL is needed — requests go to the same origin.
if (import.meta.env.VITE_API_URL) {
  setBaseUrl(import.meta.env.VITE_API_URL as string);
}

createRoot(document.getElementById('root')!).render(<App />);
