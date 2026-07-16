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

if (pathname.startsWith('/service/')) {
  const robotsMeta = document.querySelector('meta[name="robots"]') ?? document.createElement('meta');
  robotsMeta.setAttribute('name', 'robots');
  robotsMeta.setAttribute('content', 'noindex, nofollow');
  document.head.appendChild(robotsMeta);
}

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
