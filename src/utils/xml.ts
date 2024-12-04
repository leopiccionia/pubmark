import type { Root } from 'xast'
import { toXml } from 'xast-util-to-xml'

/**
 * Converts a XML AST into a XML string
 * @param tree The XML AST
 * @returns The XML string
 */
export function printXml (tree: Root): string {
  return toXml(tree, {
    closeEmptyElements: true,
  })
}
