import glob from 'fast-glob'

import { getMimeType, isValidMediaType } from '@/input/mime'

/**
 * Metadata for a valid media asset
 */
export interface Asset {
  /**
   * The asset's MIME type
   */
  mime: string
  /**
   * The asset's path
   */
  path: string
}

/**
 * Returns a list of asset files
 * @param folder The project folder
 * @returns A list of asset file paths
 */
export async function getAssets (folder: string): Promise<Asset[]> {
  const paths = await glob(['assets/**'], { cwd: folder })
  const assets = []

  for (const path of paths) {
    const mime = getMimeType(path)
    if (mime && isValidMediaType(mime)) {
      assets.push({ mime, path })
    } else {
      console.warn(`Invalid asset "${path}" with ${mime ? `"${mime}"` : 'unknown' } MIME type.`)
    }
  }

  return assets
}

/**
 * Returns a list of sections files
 * @param folder The project folder
 * @returns A list of sections file paths
 */
export async function getSections (folder: string): Promise<string[]> {
  return glob(['sections/**.md'], { cwd: folder })
}
