import { generateContainerXml } from '@/epub/container-xml'
import { saveEpub } from '@/epub/output'
import { addTextFile, createContainer, sealContainer } from '@/epub/zip'

/**
 * Generates and outputs an EPUB from a Pubmark project folder
 * @param path The Pubmark project folder
 */
export async function generateEpub (path: string): Promise<void> {
  const container = await createContainer()

  const containerXml = generateContainerXml()
  addTextFile(container, 'META-INF/container.xml', containerXml)

  const epub = await sealContainer(container)
  await saveEpub(path, epub)
}
