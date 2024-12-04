import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * Reads the content of a text file
 * @param path The path for the file
 * @returns The file content
 */
export function readTextFile (path: string): Promise<string> {
  return readFile(path, { encoding: 'utf8' })
}

/**
 * Saves a binary file to disk
 * @param path The path where the file should be saved
 * @param blob The binary data
 */
export async function writeBinaryFile (path: string, blob: Blob): Promise<void> {
  const dataView = new DataView(await blob.arrayBuffer())
  await mkdir(resolve(path, '..'), { recursive: true })
  await writeFile(path, dataView)
}
