import { getUserConfig } from '~/input/config'
import type { PubmarkConfig } from '~/input/config'
import { loadLocale } from '~/input/locale'
import type { Locale } from '~/input/locale'
import { resolvePath } from '~/utils/paths'

/**
 * The Pubmark execution context
 *
 * You must call `initialize` once before propagating it
 */
export class PubmarkContext {
  /**
   * The project folder
   */
  readonly folder: string
  /**
   * The user config
   */
  config!: PubmarkConfig
  /**
   * The user locale
   */
  locale!: Locale

  /**
   * The public constructor
   * @param folder The Pubmark project folder
   */
  constructor (folder: string) {
    this.folder = folder
  }

  /**
   * Does async initialization of context state
   */
  async initialize (): Promise<this> {
    this.config = await getUserConfig(this.folder)
    this.locale = await loadLocale(this.folder, this.config.language)
    return this
  }

  /**
   * Resolves a path relatively to Pubmark project folder
   * @param path The relative path
   */
  resolvePath (path: string): string {
    return resolvePath(this.folder, path)
  }
}
