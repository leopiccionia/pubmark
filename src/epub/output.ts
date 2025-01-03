import { sep } from 'node:path'

import { writeBinaryFile } from '~/utils/files'
import { resolvePath } from '~/utils/paths'

/**
 * Computes the path for the EPUB file
 * @param folder The Pubmark project folder
 * @returns The path for the EPUB file
 */
function computeOutputPath (folder: string): string {
  const fileName = folder.split(sep).at(-1) ?? 'book'
  return resolvePath(folder, `./dist/${fileName}.epub`)
}

/**
 * Saves an EPUB file to disk
 * @param folder The Pubmark project folder
 * @param epub The EPUB blob
 */
export async function saveEpub (folder: string, epub: Blob): Promise<void> {
  const path = computeOutputPath(folder)
  await writeBinaryFile(path, epub)
}
