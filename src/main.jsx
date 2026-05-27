import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import BusinessDevelopmentPage from './pages/BusinessDevelopmentPage';
import { initAnalytics } from './lib/analytics';

const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
const isBusinessDevelopmentPage = pathname === '/service/business-development';
const Page = isBusinessDevelopmentPage ? BusinessDevelopmentPage : App;

if (isBusinessDevelopmentPage) {
  const robotsMeta = document.querySelector('meta[name="robots"]') ?? document.createElement('meta');
  robotsMeta.setAttribute('name', 'robots');
  robotsMeta.setAttribute('content', 'noindex, nofollow');
  document.head.appendChild(robotsMeta);
}

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>
);
