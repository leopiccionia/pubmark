import type { Element } from 'xast'
import { x } from 'xastscript'

import { getUniqueIdentifier } from '@/epub/opf/metadata'
import type { PubmarkConfig } from '@/input/config'
import { extractSections } from '@/input/toc'
import type { TocEntry } from '@/input/toc'
import { readTextFile } from '@/utils/files'
import { replaceExtension, resolvePath } from '@/utils/paths'
import { stringifyXml } from '@/utils/xml'

/**
 * Converts a TOC entry into a NCX `<navPoint>` list
 * @param entries A list of links
 * @param prefix Prefix for `navPoint` IDs
 * @returns The generated NCX/XML tree
 */
function generateList (entries: TocEntry[], prefix: string = 'ncx-'): Element[] {
  return entries.map((entry, index) => x('navPoint', { id: `${prefix}-${index}` }, [
    x('navLabel', [
      x('text', entry.text),
    ]),
    x('content', { src: replaceExtension(entry.href, '.xhtml') }),
    ...(entry.children.length > 0 ? generateList(entry.children, `${prefix}-${index}-`) : []),
  ]))
}

/**
 * Generates the NCX navigation document, for EPUB 2.0 compatibility
 * @param folder The Pubmark project folder
 * @param config The user config
 * @returns The generated NCX/XML string
 *
 */
export async function generateNcx (folder: string, config: PubmarkConfig): Promise<string> {
  const source = await readTextFile(resolvePath(folder, 'README.md'))
  const toc = extractSections(source)

  const tree = x(null, [
    x('ncx', { version: '2005-1', 'xml:lang': config.language, xmlns: 'http://www.daisy.org/z3986/2005/ncx/' }, [
      x('head', [
        x('meta', { content: getUniqueIdentifier(config).id, name: 'dtb:uid' }),
      ]),
      x('docTitle', [
        x('text', config.title),
      ]),
      x('navMap', generateList(toc)),
    ]),
  ])

  return stringifyXml(tree)
}
