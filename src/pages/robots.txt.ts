import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteEnv = import.meta.env.SITE_ENV ?? process.env.SITE_ENV ?? 'staging';
  const isProd = siteEnv === 'production';

  const sitemapUrl = new URL('sitemap-index.xml', site ?? 'https://boostideal.com').toString();

  const body = isProd
    ? `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
