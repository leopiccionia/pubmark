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
 * @param cwd The root of project folder
 * @returns A list of asset file paths
 */
export async function getAssets (cwd: string): Promise<Asset[]> {
  const paths = await glob(['assets/**'], { cwd })
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
