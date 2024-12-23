import type { Element } from 'xast'
import { x } from 'xastscript'

import type { PubmarkConfig } from '@/input/config'
import { extractSections } from '@/input/toc'
import { readTextFile } from '@/utils/files'
import { generateItemId, replaceExtension, resolvePath } from '@/utils/paths'

/**
 * Generate the package's spine
 * @param folder The file path
 * @returns The generated XML tree
 */
export async function generateSpine (folder: string, config: PubmarkConfig): Promise<Element> {
  const facadeSource = await readTextFile(resolvePath(folder, './README.md'))
  const toc = extractSections(facadeSource)

  return x('spine', { 'page-progression-direction': config.direction, toc: 'toc-ncx' }, [
    x('itemref', { idref: 'index-xhtml', linear: 'yes' }),
    ...toc.map((entry) => x('itemref', {
      idref: generateItemId(replaceExtension(entry.href, '.xhtml')),
      linear: 'yes',
    })),
  ])
}
