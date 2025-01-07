import { resolvePath } from '~/utils/paths'

/**
 * An output target
 */
export type OutputTarget = 'epub' | 'html'

const DIRNAME = import.meta.dirname

/**
 * Returns the physical path for a Pubmark-core asset
 * @param path The asset's file name
 * @returns The asset's physical path
 */
export function getCoreAssetPath (path: string): string {
  return resolvePath(DIRNAME, `../static/assets/${path}`)
}

/**
 * Computes the list of ignored targets
 * @param target The output target
 * @returns The list of ignored targets
 */
export function getIgnoredTargets (target: string): OutputTarget[] {
  return (['epub', 'html'] as OutputTarget[]).filter((t) => t !== target)
}

/**
 * Sort files by output specificity
 * @param paths The file paths
 * @param target The output target
 */
export function sortAssetsByTarget (paths: string[], target: OutputTarget): string[] {
  return paths.toSorted((a, b) => {
    const specA = a.includes(`.${target}.`) ? 1 : 0
    const specB = b.includes(`.${target}.`) ? 1 : 0
    return specA - specB
  })
}
