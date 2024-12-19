import { u } from 'unist-builder'
import { x } from 'xastscript'

import { generateManifest } from '@/epub/opf/manifest'
import { generateMetadata, PUB_ID } from '@/epub/opf/metadata'
import { generateSpine } from '@/epub/opf/spine'
import type { PubmarkConfig } from '@/input/config'
import { stringifyXml } from '@/utils/xml'

/**
 * Generates a package document
 * @param folder The Pubmark project folder
 * @param config The user config
 * @returns The generated XML string
 */
export async function generateContainerOpf (folder: string, config: PubmarkConfig): Promise<string> {
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
    ])
  ])

  return stringifyXml(tree)
}
