import type { PubmarkContext } from '~/context'
import { getUserStyleAssets } from '~/input/glob'
import { getIgnoredTargets, sortAssetsByTarget } from '~/output/targets'
import type { OutputTarget } from '~/output/targets'

/**
 * Computes a list of suitable Pubmark-core styles
 * @param target The output target
 * @returns A list of CSS file names
 */
export function getCoreStyleAssets (target: OutputTarget) {
  return [
    'pubmark-core.css',
    `pubmark-core.${target}.css`,
  ]
}

/**
 * Computes a list of suitable styles
 * @param ctx The Pubmark execution context
 * @param target The output target
 * @returns A list of CSS file paths
 */
export async function getStyleAssets (ctx: PubmarkContext, target: OutputTarget) {
  const coreStyles = getCoreStyleAssets(target)
  const userStyles = await getUserStyleAssets(ctx, getIgnoredTargets(target))

  const assets = [
    ...sortAssetsByTarget(coreStyles.map((path) => `assets/${path}`), 'epub'),
    ...sortAssetsByTarget(userStyles, 'epub'),
  ]
  return assets
}
