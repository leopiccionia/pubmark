import type { Element } from 'xast'
import { x } from 'xastscript'

import { getAssets, getSections } from '@/input/glob'

/**
 * Generates an unique ID from file path
 * @param path The file path
 * @returns An unique ID
 */
function generateItemId (path: string): string {
  return path.replaceAll(/\W/g, '-')
}

/**
 * Generates the package's manifest
 * @param folder The project folder
 * @returns The generated XML tree
 */
export async function generateManifest (folder: string): Promise<Element> {
  const assets = await getAssets(folder)
  const sections = await getSections(folder)

  // @TODO Cover image

  return x('manifest', [
    x('item', {
      id: 'index-xhtml',
      href: 'index.xhtml',
      'media-type': 'application/xhtml+xml',
      properties: 'nav',
    }),
    ...assets.map((asset) => x('item', {
      id: generateItemId(asset.path),
      href: asset.path,
      'media-type': asset.mime,
    })),
    ...sections.map((section) => x('item', {
      id: generateItemId(section),
      href: section,
      'media-type': 'application/xhtml+xml',
    })),
  ])
}
