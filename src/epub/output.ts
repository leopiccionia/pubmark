import type { PubmarkContext } from '~/context'
import { writeBinaryFile } from '~/utils/files'
import { splitPath } from '~/utils/paths'

/**
 * Computes the path for the EPUB file
 * @param ctx The Pubmark execution context
 * @returns The path for the EPUB file
 */
function computeOutputPath (ctx: PubmarkContext): string {
  const fileName = splitPath(ctx.folder).at(-1) ?? 'book'
  return ctx.resolvePath(`dist/${fileName}.epub`)
}

/**
 * Saves an EPUB file to disk
 * @param ctx The Pubmark execution context
 * @param epub The EPUB blob
 */
export async function saveEpub (ctx: PubmarkContext, epub: Blob): Promise<void> {
  const path = computeOutputPath(ctx)
  await writeBinaryFile(path, epub)
}
