import { x } from 'xastscript'

import type { PubmarkContext } from '@/context'
import type { Asset } from '@/input/glob'
import { createTemplate } from '@/utils/templates'
import { stringifyXml } from '@/utils/xml'

/**
 * Wraps the cover into a XHTML file
 * @param ctx The Pubmark execution context
 * @param asset The cover asset
 * @returns The generated XML string
 */
export async function generateCoverXhtml (ctx: PubmarkContext, asset: Asset): Promise<string> {
  const template = await createTemplate('epub-cover.html', ['config', 'content', 'title'] as const)

  const tree = x(null, [
    x('section', { 'epub:type': 'cover' }, [
      x('img', {
        alt: ctx.locale['cover'],
        src: asset.href,
        title: ctx.locale['cover'],
      }),
    ]),
  ])

  return template({
    config: ctx.config,
    content: stringifyXml(tree),
    title: ctx.locale['cover'],
  })
}
