import glob from 'fast-glob'

import type { PubmarkContext } from '@/context'
import { getMimeType, isCoreMediaType } from '@/input/mime'

/**
 * Returns a list of asset files
 * @param ctx The Pubmark execution context
 * @returns A list of asset file paths
 */
export async function getAssets (ctx: PubmarkContext): Promise<string[]> {
  const paths = await glob(['assets/**'], { cwd: ctx.folder })
  const assets = []

  for (const path of paths) {
    const mime = getMimeType(path)
    if (mime && isCoreMediaType(mime)) {
      assets.push(path)
    } else {
      console.warn(`Invalid asset "${path}" with ${mime ? `"${mime}"` : 'unknown' } MIME type.`)
    }
  }

  return assets
}

/**
 * Returns the cover file
 * @param ctx The Pubmark execution context
 * @returns The cover asset, or `undefined` if not found
 */
export async function getCover (ctx: PubmarkContext): Promise<string | undefined> {
  const paths = await glob(['cover.**'], { cwd: ctx.folder })

  for (const path of paths) {
    const mime = getMimeType(path)
    if (mime && isCoreMediaType(mime)) {
      return path
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
