import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.yinai.cn',
  build: {
    format: 'preserve',
  },
  trailingSlash: 'ignore',
});