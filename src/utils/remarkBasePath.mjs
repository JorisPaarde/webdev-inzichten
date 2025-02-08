import { visit } from 'unist-util-visit';

export function remarkBasePath() {
  return function (tree) {
    const base = process.env.NODE_ENV === 'development' ? '' : '/webdev-inzichten';

    visit(tree, ['image', 'html'], (node) => {
      // Handle markdown images
      if (node.type === 'image' && node.url) {
        if (node.url.startsWith('/')) {
          node.url = `${base}${node.url}`;
        }
      }
      
      // Handle HTML img tags in markdown
      if (node.type === 'html' && typeof node.value === 'string') {
        node.value = node.value.replace(
          /(<img[^>]*src=["'])(\/[^"']*)(["'][^>]*>)/g,
          `$1${base}$2$3`
        );
      }
    });
  };
} 