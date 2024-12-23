import { u } from 'unist-builder'
import { x } from 'xastscript'

import { generateManifest } from '@/epub/opf/manifest'
import { generateMetadata, PUB_ID } from '@/epub/opf/metadata'
import { generateSpine } from '@/epub/opf/spine'
import type { PubmarkConfig } from '@/input/config'
import type { Locale } from '@/input/locale'
import { stringifyXml } from '@/utils/xml'

/**
 * Generates a package document
 * @param folder The Pubmark project folder
 * @param config The user config
 * @param locale The user locale
 * @returns The generated XML string
 */
export async function generateContentOpf (folder: string, config: PubmarkConfig, locale: Locale): Promise<string> {
  const tree = x(null, [
    u('instruction', { name: 'xml' }, 'version="1.0"'),
    x('package', {
      dir: config.direction,
      'unique-identifier': PUB_ID,
      version: '3.0',
      'xml:lang': config.language,
      xmlns: 'http://www.idpf.org/2007/opf',
    }, [
      generateMetadata(config),
      await generateManifest(folder),
      await generateSpine(folder, config),
      x('guide', [
        x('reference', { href: 'index.xhtml#toc', title: locale['toc'], type: 'toc' })
      ]),
    ])
  ])

  return stringifyXml(tree)
}
