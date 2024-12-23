import { u } from 'unist-builder'
import { x } from 'xastscript'

import type { PubmarkContext } from '@/context'
import { generateManifest } from '@/epub/opf/manifest'
import { generateMetadata, PUB_ID } from '@/epub/opf/metadata'
import { generateSpine } from '@/epub/opf/spine'
import { stringifyXml } from '@/utils/xml'

/**
 * Generates a package document
 * @param ctx The Pubmark execution context
 * @returns The generated XML string
 */
export async function generateContentOpf (ctx: PubmarkContext): Promise<string> {
  const tree = x(null, [
    u('instruction', { name: 'xml' }, 'version="1.0" encoding="utf-8"'),
    x('package', {
      dir: ctx.config.direction,
      'unique-identifier': PUB_ID,
      version: '3.0',
      'xml:lang': ctx.config.language,
      xmlns: 'http://www.idpf.org/2007/opf',
    }, [
      await generateMetadata(ctx),
      await generateManifest(ctx),
      await generateSpine(ctx),
      x('guide', [
        x('reference', { href: 'index.xhtml#toc', title: ctx.locale['toc'], type: 'toc' })
      ]),
    ])
  ])

  return stringifyXml(tree)
}
