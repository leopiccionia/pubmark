import { resolve } from 'node:path'

import { Eta } from 'eta'

import { readTextFile } from '@/utils/files'

type Template<T extends string[]> = (data: Record<T[number], any>) => string

/**
 * Compiles a function from its source code
 * @param template The source code
 * @param variables The list of template variables
 * @returns The compiled template function
 */
function compileTemplate<T extends string[]> (template: string, variables: T): Template<T> {
  const eta = new Eta({
    functionHeader: `const { ${variables.join(', ')} } = it;`,
  })
  return eta.compile(template).bind(eta) as Template<T>
}

/**
 * Compiles a template from its path
 * @param path The template path
 * @param variables The list of template variables
 * @returns The compiled template function
 */
export async function createTemplate<T extends string[]> (path: string, variables: T): Promise<Template<T>> {
  const source = await readTextFile(resolve(import.meta.dirname, `../templates/${path}`))
  return compileTemplate(source, variables)
}
