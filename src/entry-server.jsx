import { renderToString } from 'react-dom/server';
import SitePage from './SitePage';
import { routes, findRoute, canonicalFor, SITE_URL } from './routes';

export { routes, canonicalFor, SITE_URL };

export function render(pathname = '/') {
  const route = findRoute(pathname);
  const Page = route.component;

  return renderToString(<SitePage Page={Page} />);
}
