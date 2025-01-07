import { Eta } from 'eta'

import { readTextFile } from '~/utils/files'
import { resolvePath } from '~/utils/paths'

type Template<T extends string[]> = (data: Record<T[number], any>) => string

const DIRNAME = import.meta.dirname

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
  const source = await readTextFile(resolvePath(DIRNAME, `../templates/${path}`))
  return compileTemplate(source, variables)
}
