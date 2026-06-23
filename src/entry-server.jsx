import { renderToString } from 'react-dom/server';
import App from './App';
import BusinessDevelopmentPage from './pages/BusinessDevelopmentPage';
import BusinessGrowthPage from './pages/BusinessGrowthPage';
import SitePage from './SitePage';

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
];

export function render(pathname = '/') {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const route = routes.find((item) => item.path === normalizedPath) ?? routes[0];
  const Page = route.component;

  return renderToString(<SitePage Page={Page} />);
}
