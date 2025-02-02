import type { EbookMeta } from '@leopiccionia/epub-builder'

import { getUserConfig } from '~/input/config'
import { loadLocale } from '~/input/locale'
import type { Locale } from '~/input/locale'
import { resolvePath } from '~/utils/paths'

/**
 * The Pubmark execution context
 */
export class PubmarkContext {
  /**
   * The project folder
   */
  readonly folder: string
  /**
   * The user config
   */
  config!: EbookMeta
  /**
   * The user locale
   */
  locale!: Locale

  /**
   * The private constructor
   * @param folder The Pubmark project folder
   */
  private constructor (folder: string) {
    this.folder = folder
  }

  /**
   * Returns a new `PubmarkContext`
   * @param folder The Pubmark project folder
   */
  static async init (folder: string): Promise<PubmarkContext> {
    const context = new PubmarkContext(folder)
    const config = await getUserConfig(folder)
    context.config = config
    context.locale = await loadLocale(folder, config.language)
    return context
  }

  /**
   * Resolves a path relatively to Pubmark project folder
   * @param path The relative path
   */
  resolvePath (path: string): string {
    return resolvePath(this.folder, path)
  }
}
