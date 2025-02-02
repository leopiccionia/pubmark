import type { TocEntry } from '@leopiccionia/epub-builder'

/**
 * Extracts the ebook spine from the table of contents
 * @param toc The table of contents
 * @param hasCover Whether the ebook has a cover asset
 * @returns The ebook spine
 */
export function extractSpine (toc: TocEntry[], hasCover: boolean): string[] {
  const files = [
    ...(hasCover ? ['cover.xhtml'] : []),
    'index.xhtml',
    ...toc.map((entry) => entry.href),
  ]

  return [...new Set(files)] /* Remove duplicate items */
}
