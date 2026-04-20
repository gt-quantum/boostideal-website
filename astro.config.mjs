import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://boostideal.com',
  integrations: [sitemap(), mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
