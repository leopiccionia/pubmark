import { addBinaryFile, addTextFile } from '~/epub/zip'
import type { ZipContainer } from '~/epub/zip'
import { getMimeType } from '~/input/mime'
import { readBinaryFile, readTextFile } from '~/utils/files'

/**
 * A resource manifest property
 * @see https://www.w3.org/TR/epub-33/#app-item-properties-vocab
 */
export type ResourceProperty = 'cover-image' | 'mathml' | 'nav' | 'remote-resources' | 'scripted' | 'svg' | 'switch'

/**
 * A resource representing a file asset
 */
export interface Resource {
  /**
   * The resource's path
   */
  href: string
  /**
   * The resource's MIME type
   */
  mime: string
  /**
   * The resource's manifest property
   */
  property: ResourceProperty | undefined
  /**
   * Copies the resource's content into the EPUB container
   * @param container The EPUB container
   */
  addToContainer (container: ZipContainer): Promise<void>
}

/**
 * A binary-encoded resource
 */
export class BinaryResource implements Resource {
  /**
   * The resource's path
   */
  href: string
  /**
   * The resource's MIME type
   */
  mime: string
  /**
   * The resource's manifest property
   */
  property: ResourceProperty | undefined

  /**
   * The resource's binary-encoded content
   */
  private content: Blob | undefined

  /**
   * The private constructor
   * @param href The resource's path
   * @param content The resource's binary-encoded content
   * @param property The resource's manifest property
   */
  private constructor (href: string, content: Blob, property: ResourceProperty | undefined = undefined) {
    this.href = href
    this.mime = getMimeType(href)!
    this.property = property
    this.content = content
  }

  /**
   * Returns a resource from a file
   * @param path The resource's physical path
   * @param href The resource's path inside the EPUB container
   * @param property The resource's manifest property
   * @returns A binary-encoded resource
   */
  public static async fromFile (path: string, href: string, property: ResourceProperty | undefined = undefined): Promise<BinaryResource> {
    const content = await readBinaryFile(path)
    return new BinaryResource(href, content, property)
  }

  /**
   * Copies the resource's content into the EPUB container
   * @param container The EPUB container
   */
  public async addToContainer (container: ZipContainer): Promise<void> {
    await addBinaryFile(container, `OEBPS/${this.href}`, this.content!)
    this.content = undefined
  }
}

/**
 * A text-encoded resource
 */
export class TextResource implements Resource {
  /**
   * The resource's path
   */
  href: string
  /**
   * The resource's MIME type
   */
  mime: string
  /**
   * The resource's manifest property
   */
  property: ResourceProperty | undefined
  /**
   * The resource's text-encoded content
   */
  private content: string | undefined

  /**
   * The public constructor
   * @param href The resource's path
   * @param content The resource's text-encoded content
   * @param property The resource's manifest property
   */
  public constructor (href: string, content: string, property: ResourceProperty | undefined = undefined) {
    this.href = href
    this.mime = getMimeType(href)!
    this.property = property
    this.content = content
  }

  /**
   * Copies the resource's content into the EPUB container
   * @param container The EPUB container
   */
  public async addToContainer (container: ZipContainer): Promise<void> {
    await addTextFile(container, `OEBPS/${this.href}`, this.content!)
    this.content = undefined
  }

  /**
   * Returns a resource from a file
   * @param path The resource's physical path
   * @param href The resource's path inside the EPUB container
   * @param property The resource's manifest property
   * @returns A text-encoded resource
   */
    public static async fromFile (path: string, href: string, property: ResourceProperty | undefined = undefined): Promise<TextResource> {
      const content = await readTextFile(path)
      return new TextResource(href, content, property)
    }
}
