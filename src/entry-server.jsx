import { renderToString } from 'react-dom/server';
import SitePage from './SitePage';
import { routes, findRoute, canonicalFor, ogImagePathFor, SITE_URL } from './routes';

export { routes, canonicalFor, ogImagePathFor, SITE_URL };

export function render(pathname = '/') {
  const route = findRoute(pathname);
  const Page = route.component;

  return renderToString(<SitePage Page={Page} />);
}
