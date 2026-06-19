import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function devPrerenderPlugin() {
  let devServer;

  return {
    name: 'ludentz-dev-prerender',
    configureServer(server) {
      devServer = server;
    },
    async transformIndexHtml(html, ctx) {
      if (!devServer) return html;

      const mod = await devServer.ssrLoadModule('/src/entry-server.jsx');
      const pathname = new URL(ctx.originalUrl || '/', 'http://localhost').pathname;
      const hasRoute = mod.routes.some((route) => route.path === (pathname.replace(/\/+$/, '') || '/'));

      if (!hasRoute) return html;

      return html.replace(
        '<div id="root"></div>',
        `<div id="root">${mod.render(pathname)}</div>`
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), devPrerenderPlugin()],
});
