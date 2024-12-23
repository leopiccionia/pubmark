import type { Element } from 'xast'
import { x } from 'xastscript'

import type { PubmarkContext } from '@/context'
import { extractSections } from '@/input/toc'
import { readTextFile } from '@/utils/files'
import { generateItemId, replaceExtension, resolvePath } from '@/utils/paths'

/**
 * Generate the package's spine
 * @param ctx The Pubmark execution context
 * @returns The generated XML tree
 */
export async function generateSpine (ctx: PubmarkContext): Promise<Element> {
  const facadeSource = await readTextFile(resolvePath(ctx.folder, './README.md'))
  const toc = extractSections(facadeSource)

  return x('spine', { 'page-progression-direction': ctx.config.direction, toc: 'toc-ncx' }, [
    x('itemref', { idref: 'index-xhtml', linear: 'yes' }),
    ...toc.map((entry) => x('itemref', {
      idref: generateItemId(replaceExtension(entry.href, '.xhtml')),
      linear: 'yes',
    })),
  ])
}
