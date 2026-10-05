const githubPagesBasePath = "/regmi-kirana-store";

export function sitePath(path: string) {
  if (path.startsWith(githubPagesBasePath)) return path;
  return `${githubPagesBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export function assetPath(path: string) {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return sitePath(path);
}
