import type { Resource } from '@leopiccionia/epub-builder'
import { x } from 'xastscript'

import type { PubmarkContext } from '~/context'
import { getStyleAssets } from '~/output/styles'
import { createTemplate } from '~/utils/templates'
import { stringifyXml } from '~/utils/xml'

/**
 * Wraps the cover into a XHTML file
 * @param ctx The Pubmark execution context
 * @param resource The cover's resource
 * @returns The generated XML string
 */
export async function generateCoverXhtml (ctx: PubmarkContext, resource: Resource): Promise<string> {
  const template = await createTemplate('epub-cover.html', ['config', 'content', 'styles', 'title'] as const)

  const tree = x(null, [
    x('section', { 'epub:type': 'cover' }, [
      x('img', {
        alt: ctx.locale['cover'],
        src: resource.href,
        title: ctx.locale['cover'],
      }),
    ]),
  ])

  return template({
    config: ctx.config,
    content: stringifyXml(tree),
    styles: await getStyleAssets(ctx, 'epub'),
    title: ctx.locale['cover'],
  })
}
