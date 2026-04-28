import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import BusinessDevelopmentPage from './pages/BusinessDevelopmentPage';

const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
const Page = pathname === '/service/business-development' ? BusinessDevelopmentPage : App;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>
);
