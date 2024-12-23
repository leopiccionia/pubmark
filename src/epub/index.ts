import { PubmarkContext } from '@/context'
import { generateContainerXml } from '@/epub/container-xml'
import { generateContentOpf } from '@/epub/content-opf'
import { generateNavXhtml } from '@/epub/nav-xhtml'
import { generateNcx } from '@/epub/ncx'
import { saveEpub } from '@/epub/output'
import { compileSectionsToXhtml, compileIndexToXhtml } from '@/epub/xhtml'
import { addBinaryFile, addTextFile, createContainer, sealContainer } from '@/epub/zip'
import { getAssets, getSections } from '@/input/glob'
import { readBinaryFile } from '@/utils/files'
import { resolvePath } from '@/utils/paths'

/**
 * Generates and outputs an EPUB from a Pubmark project folder
 * @param folder The Pubmark project folder
 */
export async function generateEpub (folder: string): Promise<void> {
  const ctx = new PubmarkContext(folder)
  await ctx.initialize()

  const assets = await getAssets(folder)
  const sections = await getSections(folder)

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
    const blob = await readBinaryFile(resolvePath(folder, asset.path))
    addBinaryFile(container, `OEBPS/${asset.path}`, blob)
  }

  const epub = await sealContainer(container)
  await saveEpub(folder, epub)
}
