import { v4 as uuid } from '@lukeed/uuid/secure'
import { defu } from 'defu'
import { load as parseYaml } from 'js-yaml'

import { readTextFile } from '@/utils/files'
import { resolvePath } from '@/utils/paths'

/**
 * The Pubmark config
 */
export type PubmarkConfig = {
  /**
   * The book title
   */
  title: string,
  /**
   * The book subtitle
   */
  subtitle: string,
  /**
   * The book description
   */
  description: string,
  /**
   * The reading direction (left-to-right, right-to-left, or auto)
   */
  direction: 'ltr' | 'rtl' | 'auto',
  /**
   * The language tag
   * @see https://www.w3.org/International/articles/language-tags/
   */
  language: string,
  /**
   * The book publisher
   */
  publisher: {
    /**
     * The publisher type
     */
    type?: 'Organization' | 'Person',
    /**
     * The publisher name
     */
    name: string
  },
  /**
   * A list of contributors to the book
   */
  creators: Array<{
    /**
     * The contributor's name
     */
    name: string,
    /**
     * The contributor's role MARC code
     * @see https://www.loc.gov/marc/relators/relaterm.html
     */
    role: string,
    /**
     * The contributor's type
     */
    type?: 'Organization' | 'Person',
    /**
     * Normalized form of contributor's name
     */
    'file as'?: string,
    /**
     * Contributor's name in alternative scripts or languages
     */
    alternate?: { [language: string]: string },
  }>,
  /**
   * Unique identifiers
   */
  ids: {
    /**
     * An ISBN (International Standard Book Number) identifier
     */
    isbn?: string,
    /**
     * A DOI (Digital Object Identifier) identifier
     */
    doi?: string,
    /**
     * An UUID (Universally Unique Identifier) v4-compatible identifier
     */
    uuid?: string,
  },
}

/**
 * Fills the user-provided config with default values
 * @param partialConfig The partial user config
 * @returns The completely filled user config
 */
export function populateUserConfig (partialConfig: Partial<PubmarkConfig>): PubmarkConfig {
  return defu(partialConfig, {
    title: '',
    subtitle: '',
    description: '',
    direction: 'ltr' as const,
    language: 'en',
    publisher: {
      type: 'Organization' as const,
      name: '',
    },
    creators: [],
    ids: {
      uuid: uuid(),
    },
  })
}

/**
 * Throws if the user-provided config is invalid
 * @param partialConfig The partial user config
 */
function validateUserConfig (partialConfig: Partial<PubmarkConfig>): void {
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
export async function getUserConfig (folder: string): Promise<PubmarkConfig> {
  try {
    const text = await readTextFile(resolvePath(folder, './meta.yaml'))
    const partialConfig = parseYaml(text) as Partial<PubmarkConfig>
    validateUserConfig(partialConfig)
    const config = populateUserConfig(partialConfig)
    return config
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error parsing \`meta.yaml\` file: ${err.message}`)
    } else {
      throw new Error('Unknown error while parsing `meta.yaml` file')
    }
  }
}
