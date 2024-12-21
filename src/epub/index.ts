import { generateContainerOpf } from '@/epub/container-opf'
import { generateContainerXml } from '@/epub/container-xml'
import { generateNavXhtml } from '@/epub/nav-xhtml'
import { saveEpub } from '@/epub/output'
import { compileSectionsToXhtml, compileIndexToXhtml } from '@/epub/xhtml'
import { addBinaryFile, addTextFile, createContainer, sealContainer } from '@/epub/zip'
import { getUserConfig } from '@/input/config'
import { getAssets, getSections } from '@/input/glob'
import { readBinaryFile } from '@/utils/files'
import { resolvePath } from '@/utils/paths'

/**
 * Generates and outputs an EPUB from a Pubmark project folder
 * @param folder The Pubmark project folder
 */
export async function generateEpub (folder: string): Promise<void> {
  const assets = await getAssets(folder)
  const config = await getUserConfig(folder)
  const sections = await getSections(folder)

  const container = await createContainer()

  const containerXml = generateContainerXml()
  addTextFile(container, 'META-INF/container.xml', containerXml)

  const containerOpf = await generateContainerOpf(folder, config)
  addTextFile(container, 'EPUB/container.opf', containerOpf)

  addTextFile(container, 'EPUB/nav.xhtml', await generateNavXhtml(folder, config))
  addTextFile(container, 'EPUB/index.xhtml', await compileIndexToXhtml(folder, config))

  for (const { content, path } of await compileSectionsToXhtml(folder, sections, config)) {
    addTextFile(container, `EPUB/${path}`, content)
  }

  for (const asset of assets) {
    const blob = await readBinaryFile(resolvePath(folder, asset.path))
    addBinaryFile(container, `EPUB/${asset.path}`, blob)
  }

  const epub = await sealContainer(container)
  await saveEpub(folder, epub)
}
