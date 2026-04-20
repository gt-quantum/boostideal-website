import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://boostideal.com',
  integrations: [sitemap(), mdx(), markdoc(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
