import type { Element } from 'xast'
import { x } from 'xastscript'

import type { PubmarkContext } from '@/context'
import { getAssets, getSections } from '@/input/glob'
import { generateItemId, replaceExtension } from '@/utils/paths'

/**
 * Generates the package's manifest
 * @param ctx The Pubmark execution context
 * @returns The generated XML tree
 */
export async function generateManifest (ctx: PubmarkContext): Promise<Element> {
  const assets = await getAssets(ctx.folder)
  const sections = await getSections(ctx.folder)

  // @TODO Cover image

  return x('manifest', [
    x('item', { id: 'toc-ncx', href: 'toc.ncx', 'media-type': 'application/x-dtbncx+xml' }),
    x('item', { id: 'nav-xhtml', href: 'nav.xhtml', 'media-type': 'application/xhtml+xml', properties: 'nav' }),
    x('item', { id: 'index-xhtml', href: 'index.xhtml', 'media-type': 'application/xhtml+xml' }),
    ...sections.map((section) => {
      const href = replaceExtension(section, '.xhtml')
      return x('item', {
        id: generateItemId(href),
        href,
        'media-type': 'application/xhtml+xml',
      })
    }),
    ...assets.map((asset) => x('item', {
      id: generateItemId(asset.path),
      href: asset.path,
      'media-type': asset.mime,
    })),
  ])
}
