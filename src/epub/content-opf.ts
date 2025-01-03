import { u } from 'unist-builder'
import { x } from 'xastscript'

import type { PubmarkContext } from '~/context'
import { generateManifest } from '~/epub/opf/manifest'
import { generateMetadata, PUB_ID } from '~/epub/opf/metadata'
import { generateSpine } from '~/epub/opf/spine'
import type { Resource } from '~/epub/resource'
import { stringifyXml } from '~/utils/xml'

/**
 * Generates a package document
 * @param ctx The Pubmark execution context
 * @param resources The list of packaged resources
 * @returns The generated XML string
 */
export async function generateContentOpf (ctx: PubmarkContext, resources: Resource[]): Promise<string> {
  const cover = resources.find((resource) => resource.property === 'cover-image')

  const tree = x(null, [
    u('instruction', { name: 'xml' }, 'version="1.0" encoding="utf-8"'),
    x('package', {
      dir: ctx.config.direction,
      'unique-identifier': PUB_ID,
      version: '3.0',
      'xml:lang': ctx.config.language,
      xmlns: 'http://www.idpf.org/2007/opf',
    }, [
      await generateMetadata(ctx, cover),
      await generateManifest(resources),
      await generateSpine(ctx, cover),
      x('guide', [
        x('reference', { href: 'index.xhtml#toc', title: ctx.locale['toc'], type: 'toc' })
      ]),
    ])
  ])

  return stringifyXml(tree)
}
