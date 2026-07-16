import App from './App';
import BusinessDevelopmentPage from './pages/BusinessDevelopmentPage';
import BusinessGrowthPage from './pages/BusinessGrowthPage';
import AxConsultingPage from './pages/AxConsultingPage';
import AdOperationsAxPage from './pages/AdOperationsAxPage';
import ProspectingAxPage from './pages/ProspectingAxPage';
import PublishingAxPage from './pages/PublishingAxPage';

export const routes = [
  {
    path: '/',
    component: App,
    file: 'index.html',
  },
  {
    path: '/service/business-development',
    component: BusinessDevelopmentPage,
    file: 'service/business-development/index.html',
  },
  {
    path: '/service/business-growth',
    component: BusinessGrowthPage,
    file: 'service/business-growth/index.html',
  },
  {
    path: '/service/ax-consulting',
    component: AxConsultingPage,
    file: 'service/ax-consulting/index.html',
  },
  {
    path: '/service/ad-operations-ax',
    component: AdOperationsAxPage,
    file: 'service/ad-operations-ax/index.html',
  },
  {
    path: '/service/prospecting-ax',
    component: ProspectingAxPage,
    file: 'service/prospecting-ax/index.html',
  },
  {
    path: '/service/publishing-ax',
    component: PublishingAxPage,
    file: 'service/publishing-ax/index.html',
  },
];

export function findRoute(pathname = '/') {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  return routes.find((route) => route.path === normalizedPath) ?? routes[0];
}
