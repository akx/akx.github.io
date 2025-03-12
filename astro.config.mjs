// @ts-check
import { ViteToml } from 'vite-plugin-toml';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react()],
  vite: { plugins: [ViteToml()] },
});
