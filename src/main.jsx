import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import BusinessDevelopmentPage from './pages/BusinessDevelopmentPage';
import BusinessGrowthPage from './pages/BusinessGrowthPage';
import AxConsultingPage from './pages/AxConsultingPage';
import SitePage from './SitePage';
import { initAnalytics } from './lib/analytics';

const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
const isBusinessDevelopmentPage = pathname === '/service/business-development';
const isBusinessGrowthPage = pathname === '/service/business-growth';
const isAxConsultingPage = pathname === '/service/ax-consulting';
const Page = isBusinessDevelopmentPage
  ? BusinessDevelopmentPage
  : isBusinessGrowthPage
    ? BusinessGrowthPage
    : isAxConsultingPage
      ? AxConsultingPage
      : App;

if (isBusinessDevelopmentPage || isBusinessGrowthPage || isAxConsultingPage) {
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
