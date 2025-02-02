import { defu } from 'defu'

import { readTextFile } from '~/utils/files'
import { resolvePath } from '~/utils/paths'

export type Locale = Record<string, string>

const DIRNAME = import.meta.dirname

/**
 * Loads text translations and localizations
 * @param folder The Pubmark project folder
 * @param language The book's language
 * @returns The locale map
 */
export async function loadLocale (folder: string, language: string): Promise<Locale> {
  const languageParts = language.split('-')

  const languageStack = [
    resolvePath(folder, 'locale.json'),
    resolvePath(DIRNAME, `../static/locales/${language}.json`)
  ]

  if (languageParts.length > 1) {
    languageStack.push(resolvePath(DIRNAME, `../static/locales/${languageParts[0]}.json`))
  }

  if (languageParts[0] !== 'en') {
    languageStack.push(resolvePath(DIRNAME, '../static/locales/en.json'))
  }

  let translations = {}

  for (let path of languageStack) {
    try {
      const json = await readTextFile(path)
      if (json) {
        translations = defu(translations, JSON.parse(json))
      }
    } catch {}
  }

  return translations
}
