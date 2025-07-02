export const stringToSlug = (str: string) => {
  return str.toLowerCase().trim().replace(/\s+/g, "-")
}