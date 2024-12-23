import type { Element } from 'xast'
import { x } from 'xastscript'

import type { PubmarkContext } from '@/context'
import { getAssets, getCover, getSections } from '@/input/glob'
import type { Asset } from '@/input/glob'
import { generateItemId, replaceExtension } from '@/utils/paths'

/**
 * Generates the package's manifest
 * @param ctx The Pubmark execution context
 * @returns The generated XML tree
 */
export async function generateManifest (ctx: PubmarkContext): Promise<Element> {
  const assets = await getAssets(ctx)
  const cover = await getCover(ctx)
  const sections = await getSections(ctx)

  return x('manifest', [
    generateManifestItem({ href: 'toc.ncx', mime: 'application/x-dtbncx+xml' }),
    generateManifestItem({ href: 'nav.xhtml', mime: 'application/xhtml+xml' }, 'nav'),
    generateManifestItem({ href: 'index.xhtml', mime: 'application/xhtml+xml' }),
    ...sections.map((section) => generateManifestItem({
      href: replaceExtension(section, '.xhtml'),
      mime: 'application/xhtml+xml',
    })),
    cover && x(null, [
      generateManifestItem(cover, 'cover-image'),
      generateManifestItem({ href: 'cover.xhtml', mime: 'application/xhtml+xml' }),
    ]),
    ...assets.map((asset) => generateManifestItem(asset)),
  ])
}

/**
 * Generate a manifest item for an asset
 * @param asset The asset
 * @param properties Special item properties
 * @returns The generated XML tree
 */
function generateManifestItem (asset: Asset, properties: string | undefined = undefined): Element {
  return x('item', {
    href: asset.href,
    id: generateItemId(asset.href),
    'media-type': asset.mime,
    properties,
  })
}
