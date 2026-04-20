import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://cms.boostideal.com',
  output: 'server',
  adapter: netlify(),
  integrations: [react(), markdoc(), keystatic()],
});
