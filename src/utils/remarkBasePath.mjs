import { visit } from 'unist-util-visit';

export function remarkBasePath() {
  return function (tree) {
    const base = process.env.NODE_ENV === 'development' ? '' : '/webdev-inzichten';

    visit(tree, ['image', 'html', 'link'], (node) => {
      // Handle markdown images
      if (node.type === 'image' && node.url) {
        if (node.url.startsWith('/')) {
          node.url = `${base}${node.url}`;
        }
      }
      
      // Handle markdown links
      if (node.type === 'link' && node.url) {
        if (node.url.startsWith('/')) {
          node.url = `${base}${node.url}`;
        }
      }

      // Handle HTML img tags and links in markdown
      if (node.type === 'html' && typeof node.value === 'string') {
        // Handle img tags
        node.value = node.value.replace(
          /(<img[^>]*src=["'])(\/[^"']*)(["'][^>]*>)/g,
          `$1${base}$2$3`
        );
        
        // Handle anchor tags
        node.value = node.value.replace(
          /(<a[^>]*href=["'])(\/[^"']*)(["'][^>]*>)/g,
          `$1${base}$2$3`
        );
      }
    });
  };
} 