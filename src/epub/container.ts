import type { PubmarkContext } from '~/context'
import { generateContainerXml } from '~/epub/container-xml'
import { generateContentOpf } from '~/epub/content-opf'
import type { Resource } from '~/epub/resource'
import { addTextFile, createContainer, sealContainer } from '~/epub/zip'
import type { ZipContainer } from '~/epub/zip'

/**
 * Wrapper class for EPUB-aware ZIP container
 *
 * You must call `initialize` once before acting on it
 */
export class EpubContainer {
  /**
   * The EPUB container
   */
  private container!: ZipContainer
  /**
   * The Pubmark execution context
   */
  private ctx: PubmarkContext
  /**
   * The list of packaged resources
   */
  private resources: Resource[]

  /**
   * The public constructor
   * @param ctx The Pubmark execution context
   */
  constructor (ctx: PubmarkContext) {
    this.ctx = ctx
    this.resources = []
  }

  /**
   * Adds a resource to the container
   * @param resource A resource representing a file asset
   */
  async addResource (resource: Resource): Promise<void> {
    await resource.addToContainer(this.container)
    this.resources.push(resource)
  }

  /**
   * Does async initialization of container
   */
  async initialize (): Promise<this> {
    this.container = await createContainer()
    addTextFile(this.container, 'META-INF/container.xml', generateContainerXml())

    return this
  }

  /**
   * Closes the EPUB container, returning its content
   * @returns The EPUB binary data
   */
  async seal (): Promise<Blob> {
    addTextFile(this.container, 'OEBPS/content.opf', await generateContentOpf(this.ctx, this.resources))

    return sealContainer(this.container)
  }
}
