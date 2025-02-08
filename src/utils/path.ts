const withBase = (path: string | undefined): string => {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || '';
  // Remove trailing slash from base and leading slash from path
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Join with a single slash
  return `${cleanBase}/${cleanPath}`;
};

export { withBase }; 