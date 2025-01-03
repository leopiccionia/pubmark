import type { Element } from 'xast'
import { x } from 'xastscript'

import type { Resource } from '~/epub/resource'
import { generateItemId } from '~/utils/paths'

/**
 * Generates the package's manifest
 * @param resources The list of packaged resources
 * @returns The generated XML tree
 */
export async function generateManifest (resources: Resource[]): Promise<Element> {
  return x('manifest', resources.map((resource) => x('item', {
    href: resource.href,
    id: generateItemId(resource.href),
    'media-type': resource.mime,
    properties: resource.property,
  })))
}
