const withBase = (path: string | undefined): string => {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || '';
  return `${base}${path.startsWith('/') ? path.slice(1) : path}`;
};

export { withBase }; 