import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

function lazyLoadContentImages() {
  return {
    name: 'lazy-load-content-images',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const distDir = fileURLToPath(dir);
        let updatedFiles = 0;

        const walk = (currentDir) => {
          for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
              walk(fullPath);
            } else if (entry.name.endsWith('.html')) {
              const html = fs.readFileSync(fullPath, 'utf8');
              const next = html.replace(
                /<img(?![^>]*\bloading=)(?=[^>]*\/d\/file\/)/gi,
                '<img loading="lazy" decoding="async"'
              );
              if (next !== html) {
                fs.writeFileSync(fullPath, next, 'utf8');
                updatedFiles++;
              }
            }
          }
        };

        walk(distDir);
        console.log(`[lazy-load] 已为 ${updatedFiles} 个静态页面自动补全图片懒加载`);
      },
    },
  };
}

export default defineConfig({
  site: 'https://www.yinai.cn',
  build: {
    format: 'preserve',
  },
  trailingSlash: 'ignore',
  integrations: [lazyLoadContentImages()],
});