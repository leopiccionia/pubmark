import type { TocEntry } from '@leopiccionia/epub-builder'

import { replaceExtension } from '~/utils/paths'

/**
 * Normalizes a relative link, returning only the pathname
 * @param href The relative link
 * @returns The normalized link
 */
function normalizePath (href: string): string {
  const url = new URL(href, 'toc://')
  return url.pathname.slice(1)
}

/**
 * Normalizes an entry in the the table of contents for use in EPUB
 * @param entry The original entry
 * @returns The normalized entry
 */
export function normalizeToc (entry: TocEntry): TocEntry {
  return {
    text: entry.text,
    href: replaceExtension(normalizePath(entry.href), '.xhtml'),
    children: entry.children?.map(normalizeToc),
  }
}
