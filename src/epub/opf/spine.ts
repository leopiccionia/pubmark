import type { Element } from 'xast'
import { x } from 'xastscript'

import type { PubmarkContext } from '~/context'
import type { Resource } from '~/epub/resource'
import { getCover } from '~/input/glob'
import { extractSections } from '~/input/toc'
import { readTextFile } from '~/utils/files'
import { generateItemId, replaceExtension, resolvePath } from '~/utils/paths'

/**
 * Generate the package's spine
 * @param ctx The Pubmark execution context
 * @param cover The cover's resource
 * @returns The generated XML tree
 */
export async function generateSpine (ctx: PubmarkContext, cover: Resource | undefined): Promise<Element> {
  const facadeSource = await readTextFile(resolvePath(ctx.folder, './README.md'))
  const toc = extractSections(facadeSource)

  return x('spine', { 'page-progression-direction': ctx.config.direction, toc: 'toc-ncx' }, [
    cover && x('itemref', { idref: 'cover-xhtml', linear: 'yes' }),
    x('itemref', { idref: 'index-xhtml', linear: 'yes' }),
    ...toc.map((entry) => x('itemref', {
      idref: generateItemId(replaceExtension(entry.href, '.xhtml')),
      linear: 'yes',
    })),
  ])
}
