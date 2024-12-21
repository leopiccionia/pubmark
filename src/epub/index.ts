import { generateContainerOpf } from '@/epub/container-opf'
import { generateContainerXml } from '@/epub/container-xml'
import { saveEpub } from '@/epub/output'
import { compileSectionsToXhtml, compileTocIntoXhtml } from '@/epub/xhtml'
import { addTextFile, createContainer, sealContainer } from '@/epub/zip'
import { getUserConfig } from '@/input/config'
import { getAssets, getSections } from '@/input/glob'

/**
 * Generates and outputs an EPUB from a Pubmark project folder
 * @param folder The Pubmark project folder
 */
export async function generateEpub (folder: string): Promise<void> {
  const config = await getUserConfig(folder)
  const sections = await getSections(folder)

  const container = await createContainer()

  const containerXml = generateContainerXml()
  addTextFile(container, 'META-INF/container.xml', containerXml)

  const containerOpf = await generateContainerOpf(folder, config)
  addTextFile(container, 'PUBMARK/container.opf', containerOpf)

  addTextFile(container, 'index.xhtml', await compileTocIntoXhtml(folder, config))

  for (const { content, path } of await compileSectionsToXhtml(folder, sections, config)) {
    addTextFile(container, path, content)
  }

  const epub = await sealContainer(container)
  await saveEpub(folder, epub)
}
