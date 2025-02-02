import { populateConfig } from '@leopiccionia/epub-builder'
import type { EbookMeta } from '@leopiccionia/epub-builder'
import { load as parseYaml } from 'js-yaml'

import { readTextFile } from '~/utils/files'
import { resolvePath } from '~/utils/paths'

/**
 * Fills the user-provided config with default values
 * @param partialConfig The partial user config
 * @returns The completely filled user config
 */
export function populateUserConfig (partialConfig: Partial<EbookMeta>): EbookMeta {
  const filledConfig = populateConfig({
    meta: partialConfig,
    landmarks: {
      bodymatter: '',
      toc: '',
    },
    spine: [],
    toc: [],
  })

  return filledConfig.meta
}

/**
 * Throws if the user-provided config is invalid
 * @param partialConfig The partial user config
 */
function validateUserConfig (partialConfig: Partial<EbookMeta>): void {
  if (!partialConfig.title) {
    throw new Error('File misses required `title` attribute')
  }
  if (!Array.isArray(partialConfig.creators)) {
    throw new Error('File should contain a `creators` list')
  } else {
    for (const creator of partialConfig.creators) {
      if (!creator.name) {
        throw new Error('File contains one or more creator without name')
      }
    }
  }
}

/**
 * Loads the Pubmark user config
 * @param folder The Pubmark project folder
 * @returns The user config, filled with default values
 */
export async function getUserConfig (folder: string): Promise<EbookMeta> {
  try {
    const text = await readTextFile(resolvePath(folder, 'meta.yaml'))
    const config = parseYaml(text) as Partial<EbookMeta>
    validateUserConfig(config)
    return populateUserConfig(config)
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error parsing \`meta.yaml\` file: ${err.message}`, { cause: err })
    } else {
      throw new Error('Unknown error while parsing `meta.yaml` file')
    }
  }
}
