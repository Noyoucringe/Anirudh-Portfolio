import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Portfolio mount point missing.');

const portfolio = (
  <StrictMode>
    <App />
  </StrictMode>
);
if (root.hasChildNodes()) {
  hydrateRoot(root, portfolio);
} else {
  createRoot(root).render(portfolio);
}
