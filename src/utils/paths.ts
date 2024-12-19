import { format, parse, resolve } from 'node:path'

/**
 * Generates an unique ID from file path
 * @param path The file path
 * @returns An unique ID
 */
export function generateItemId (path: string): string {
  return path.replaceAll(/\W/g, '-')
}

/**
 * Replaces the extension of a file path
 * @param path The file path
 * @param extension The new file extension, with leading dot
 * @returns The modified file path
 */
export function replaceExtension (path: string, ext: string): string {
  return format({ ...parse(path), base: '', ext })
}

/**
 * Resolve a path relatively to Pubmark project folder
 * @param base The Pubmark project folder
 * @param path The relate path
 * @returns The resolved path
 */
export function resolvePath(base: string, path: string): string {
  return resolve(base, path)
}
