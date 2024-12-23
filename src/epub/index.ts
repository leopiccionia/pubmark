import { PubmarkContext } from '@/context'
import { generateContainerXml } from '@/epub/container-xml'
import { generateContentOpf } from '@/epub/content-opf'
import { generateCoverXhtml } from '@/epub/cover-xhtml'
import { generateNavXhtml } from '@/epub/nav-xhtml'
import { generateNcx } from '@/epub/ncx'
import { saveEpub } from '@/epub/output'
import { compileSectionsToXhtml, compileIndexToXhtml } from '@/epub/xhtml'
import { addBinaryFile, addTextFile, createContainer, sealContainer } from '@/epub/zip'
import type { ZipContainer } from '@/epub/zip'
import { getAssets, getCover, getSections } from '@/input/glob'
import { readBinaryFile, readTextFile } from '@/utils/files'
import { resolvePath } from '@/utils/paths'

/**
 * Copies a binary file into an EPUB container
 * @param container The EPUB container
 * @param destination The path to the file inside the container
 * @param source The file path outside the container
 */
async function copyBinaryFile (container: ZipContainer, destination: string, source: string): Promise<void> {
  const blob = await readBinaryFile(source)
  return addBinaryFile(container, destination, blob)
}

/**
 * Generates and outputs an EPUB from a Pubmark project folder
 * @param folder The Pubmark project folder
 */
export async function generateEpub (folder: string): Promise<void> {
  const ctx = new PubmarkContext(folder)
  await ctx.initialize()

  const assets = await getAssets(ctx)
  const cover = await getCover(ctx)
  const sections = await getSections(ctx)

  const container = await createContainer()

  const containerXml = generateContainerXml()
  addTextFile(container, 'META-INF/container.xml', containerXml)

  addTextFile(container, 'OEBPS/content.opf', await generateContentOpf(ctx))

  addTextFile(container, 'OEBPS/toc.ncx', await generateNcx(ctx)),
  addTextFile(container, 'OEBPS/nav.xhtml', await generateNavXhtml(ctx))
  addTextFile(container, 'OEBPS/index.xhtml', await compileIndexToXhtml(ctx))

  for (const { content, path } of await compileSectionsToXhtml(ctx, sections)) {
    addTextFile(container, `OEBPS/${path}`, content)
  }

  for (const asset of assets) {
    await copyBinaryFile(container, `OEBPS/${asset.href}`, resolvePath(folder, asset.href))
  }

  if (cover) {
    await copyBinaryFile(container, `OEBPS/${cover.href}`, resolvePath(folder, cover.href))
    await addTextFile(container, 'OEBPS/cover.xhtml', await generateCoverXhtml(ctx, cover))
  }

  const epub = await sealContainer(container)
  await saveEpub(folder, epub)
}
