import { renderToString } from 'react-dom/server';
import SitePage from './SitePage';
import { routes, findRoute } from './routes';

export { routes };

export function render(pathname = '/') {
  const route = findRoute(pathname);
  const Page = route.component;

  return renderToString(<SitePage Page={Page} />);
}
