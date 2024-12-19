import type { Element } from 'xast'
import { x } from 'xastscript'

import { getAssets, getSections } from '@/input/glob'
import { generateItemId, replaceExtension } from '@/utils/paths'

/**
 * Generates the package's manifest
 * @param folder The Pubmark project folder
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
    ...sections.map((section) => {
      const href = replaceExtension(section, '.xhtml')
      return x('item', {
        id: generateItemId(href),
        href,
        'media-type': 'application/xhtml+xml',
      })
    }),
  ])
}
