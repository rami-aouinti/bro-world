// utils/stringUtils.ts

/**
 * Tronque une chaîne de caractères si elle dépasse la longueur max.
 * @param str La chaîne d'origine
 * @param maxLength Le nombre maximal de caractères
 * @returns Une chaîne tronquée avec "..." si nécessaire
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '..'
}
