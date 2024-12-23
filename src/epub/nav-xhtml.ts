import type { Element } from 'xast'
import { x } from 'xastscript'

import type { PubmarkConfig } from '@/input/config'
import type { Locale } from '@/input/locale'
import { extractSections } from '@/input/toc'
import type { TocEntry } from '@/input/toc'
import { readTextFile } from '@/utils/files'
import { replaceExtension, resolvePath } from '@/utils/paths'
import { createTemplate } from '@/utils/templates'
import { stringifyXml } from '@/utils/xml'

/**
 * Converts a TOC entry into a XHTML list
 * @param entries A list of links
 * @returns The generated XML tree
 */
function generateList (entries: TocEntry[]): Element {
  return x('ol',
    entries.map((entry) => x('li', [
      x('a', { href: replaceExtension(entry.href, '.xhtml') }, entry.text),
      entry.children.length > 0 ? generateList(entry.children) : null
    ]))
  )
}

/**
 * Generates the navigation document
 * @param folder The Pubmark project folder
 * @param config The user config
 * @param locale The user locale
 * @returns The generated XML string
 */
export async function generateNavXhtml (folder: string, config: PubmarkConfig, locale: Locale): Promise<string> {
  const template = await createTemplate('epub-nav.html', ['config', 'content'] as const)

  const source = await readTextFile(resolvePath(folder, 'README.md'))
  const toc = extractSections(source)

  const tree = x(null, [
    x('h1', config.title),
    x('nav', { 'epub:type': 'toc' }, [
      x('h2', locale['toc']),
      generateList(toc),
    ]),
    x('nav', { 'epub:type': 'landmarks' }, [
      x('h2', locale['landmarks']),
      x('ol', [
        x('li', [
          x('a', { 'epub:type': 'toc', 'href': 'index.xhtml#toc' }, locale['toc']),
        ]),
        x('li', [
          x('a', { 'epub:type': 'bodymatter', 'href': getContentAnchor(toc[0]) }, locale['bodymatter']),
        ]),
      ]),
    ]),
  ])

  return template({
    config,
    content: stringifyXml(tree),
  })
}

/**
 * Get a link to some section's content
 * @param entry The section link
 */
function getContentAnchor (entry: TocEntry): string {
  const [path] = replaceExtension(entry.href, '.xhtml').split('#')
  return `${path}#pubmark-content`
}
