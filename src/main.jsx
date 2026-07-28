import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import './styles/index.css';
import SitePage from './SitePage';
import { findRoute } from './routes';
import { initAnalytics } from './lib/analytics';

const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
const route = findRoute(pathname);
const Page = route.component;

initAnalytics();

const root = document.getElementById('root');
const page = (
  <StrictMode>
    <SitePage Page={Page} />
  </StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, page);
} else {
  createRoot(root).render(page);
}
