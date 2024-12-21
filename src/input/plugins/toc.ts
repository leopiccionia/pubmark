/// <reference types="mdast-util-to-hast" />
/// <reference types="mdast-util-directive" />

import { h } from 'hastscript'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * The `toc` directive plugin
 * @param options The plugin options
 * @returns The Remark plugin
 */
export function tocDirectivePlugin () {
  return function (tree: Root) {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'toc') {
        const properties = node.attributes || {}
        properties.id = 'toc'
        properties.class = properties.class ? `${properties.class} toc` : 'toc'

        const data = node.data || (node.data = {})
        data.hName = 'nav'
        data.hProperties = h('nav', properties).properties
      }
    })
  }
}
