import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
import type { ZipWriterAddDataOptions } from '@zip.js/zip.js'

/**
 * Adds a binary file to an EPUB container
 * @param container The EPUB container
 * @param path The path to the file inside the container
 * @param blob The binary data
 * @param options Options passed to `zip.js`
 */
export async function addBinaryFile (container: ZipWriter<Blob>, path: string, blob: Blob, options: ZipWriterAddDataOptions = {}): Promise<void> {
  const reader = new BlobReader(blob)
  await container.add(path, reader, options)
}

/**
 * Adds a text file to an EPUB container
 * @param container The EPUB container
 * @param path The path to the file inside the container
 * @param text The textual data
 * @param options Options passed to `zip.js`
 */
export async function addTextFile (container: ZipWriter<Blob>, path: string, text: string, options: ZipWriterAddDataOptions = {}): Promise<void> {
  const reader = new TextReader(text)
  await container.add(path, reader, options)
}

/**
 * Creates a mostly empty EPUB container
 * @returns The EPUB container
 */
export async function createContainer (): Promise<ZipWriter<Blob>> {
  const writer = new BlobWriter('application/epub+zip')
  const container = new ZipWriter(writer)

  await addTextFile(container, 'mimetype', 'application/epub+zip', { compressionMethod: 0, extendedTimestamp: false })

  return container
}

/**
 * Closes the EPUB container, returning its content
 * @param container The EPUB container
 * @returns The EPUB binary data
 */
export async function sealContainer (container: ZipWriter<Blob>): Promise<Blob> {
  return container.close()
}
