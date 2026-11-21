import { defineConfig } from 'astro/config';

function rehypeLazyImages() {
  return (tree) => {
    const visit = (node) => {
      if (!node) return;
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties = node.properties || {};
        if (!node.properties.loading) node.properties.loading = 'lazy';
        if (!node.properties.decoding) node.properties.decoding = 'async';
      } else if (
        node.type === 'raw' &&
        typeof node.value === 'string' &&
        node.value.includes('<img')
      ) {
        node.value = node.value.replace(
          /<img(?![^>]*\bloading=)/gi,
          '<img loading="lazy" decoding="async"'
        );
      }
      if (Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://www.yinai.cn',
  build: {
    format: 'preserve',
  },
  trailingSlash: 'ignore',
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
});