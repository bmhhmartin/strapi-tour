export function slugFromParams(slug: string[] | undefined): string {
  if (!slug || slug.length === 0) return "home";
  return slug.join("/");
}
