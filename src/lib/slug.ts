export function generateSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/[\s-]+/g, '-') // Replace spaces/hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Trim hyphens
}
