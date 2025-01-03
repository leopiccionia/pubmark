import { resolve } from 'node:path'

import { defu } from 'defu'

import { readTextFile } from '~/utils/files'
import { resolvePath } from '~/utils/paths'

export type Locale = Record<string, string>

const DIRNAME = import.meta.dirname

/**
 * Load text translations and localizations
 * @param folder The Pubmark project folder
 * @param language The book's language
 * @returns The locale map
 */
export async function loadLocale (folder: string, language: string): Promise<Locale> {
  const languageParts = language.split('-')

  const languageStack = [
    resolvePath(folder, 'locale.json'),
    resolve(DIRNAME, `../locales/${language}.json`)
  ]

  if (languageParts.length > 1) {
    languageStack.push(resolve(DIRNAME, `../locales/${languageParts[0]}.json`))
  }

  if (languageParts[0] !== 'en') {
    languageStack.push(resolve(DIRNAME, '../locales/en.json'))
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
