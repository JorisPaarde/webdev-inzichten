import { visit } from 'unist-util-visit';

export function remarkBasePath() {
  return function (tree) {
    visit(tree, 'image', (node) => {
      if (node.url.startsWith('/')) {
        node.url = `${import.meta.env.BASE_URL}${node.url.slice(1)}`;
      }
    });
  };
} 