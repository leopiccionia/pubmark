import glob from 'fast-glob'

import type { PubmarkContext } from '@/context'
import { getMimeType, isValidMediaType } from '@/input/mime'

/**
 * Metadata for a valid media asset
 */
export interface Asset {
  /**
   * The asset's path
   */
  href: string
  /**
   * The asset's MIME type
   */
  mime: string
}

/**
 * Returns a list of asset files
 * @param ctx The Pubmark execution context
 * @returns A list of asset file paths
 */
export async function getAssets (ctx: PubmarkContext): Promise<Asset[]> {
  const paths = await glob(['assets/**'], { cwd: ctx.folder })
  const assets = []

  for (const href of paths) {
    const mime = getMimeType(href)
    if (mime && isValidMediaType(mime)) {
      assets.push({ href, mime })
    } else {
      console.warn(`Invalid asset "${href}" with ${mime ? `"${mime}"` : 'unknown' } MIME type.`)
    }
  }

  return assets
}

/**
 * Returns the cover file
 * @param ctx The Pubmark execution context
 * @returns The cover asset, or `undefined` if not found
 */
export async function getCover (ctx: PubmarkContext): Promise<Asset | undefined> {
  const paths = await glob(['cover.**'], { cwd: ctx.folder })

  for (const href of paths) {
    const mime = getMimeType(href)
    if (mime && isValidMediaType(mime)) {
      return { href, mime }
    }
  }

  return undefined
}

/**
 * Returns a list of sections files
 * @param ctx The Pubmark execution context
 * @returns A list of sections file paths
 */
export async function getSections (ctx: PubmarkContext): Promise<string[]> {
  return glob(['sections/**.md'], { cwd: ctx.folder })
}
