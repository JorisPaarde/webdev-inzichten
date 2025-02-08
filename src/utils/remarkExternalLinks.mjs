import { visit } from 'unist-util-visit';

export function remarkExternalLinks() {
  return function (tree) {
    visit(tree, 'link', (node) => {
      if (node.url.includes('[external]')) {
        // Remove the [external] marker and add target="_blank"
        node.url = node.url.replace('[external]', '');
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.target = '_blank';
        node.data.hProperties.rel = 'noopener noreferrer';
      }
    });
  };
} 