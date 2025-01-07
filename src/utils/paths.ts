import { format, parse, resolve, sep } from 'node:path'

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
 * Resolves a path relatively to a base folder
 * @param base The base folder
 * @param path The relative path
 * @returns The resolved path
 */
export function resolvePath (base: string, path: string): string {
  return resolve(base, path)
}

/**
 * Splits a file path into directory segments
 * @param path The file path
 */
export function splitPath (path: string): string[] {
  return path.split(sep)
}
