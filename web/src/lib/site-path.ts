const githubPagesBasePath = "/regmi-kirana-store";

export function sitePath(path: string) {
  return `${githubPagesBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}
