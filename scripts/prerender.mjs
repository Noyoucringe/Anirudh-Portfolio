import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

// Use the same React tree for the static document and client hydration.
const compiler = await createServer({
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});

try {
  const { default: App } = await compiler.ssrLoadModule('/src/App.tsx');
  const index = new URL('../dist/index.html', import.meta.url);
  const html = await readFile(index, 'utf8');
  const mount = '<div id="root"></div>';
  if (!html.includes(mount)) throw new Error('Portfolio mount point missing from the Vite output.');
  const rendered = renderToString(createElement(App));
  await writeFile(
    index,
    html.replace(mount, () => '<div id="root">' + rendered + '</div>'),
  );
} finally {
  await compiler.close();
}
