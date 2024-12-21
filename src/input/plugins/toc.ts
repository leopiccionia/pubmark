/// <reference types="mdast-util-to-hast" />
/// <reference types="mdast-util-directive" />

import { h } from 'hastscript'
import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Options for `toc` directive plugin
 */
interface TocDirectiveOptions {
  /**
   * Target output
   */
  target: 'epub' | 'html'
}

/**
 * The `toc` directive plugin
 * @param options The plugin options
 * @returns The Remark plugin
 */
export function tocDirectivePlugin (options: TocDirectiveOptions) {
  return function (tree: Root) {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'toc') {
        const properties = node.attributes || {}
        properties.id = 'toc'
        properties.class = properties.class ? `${properties.class} toc` : 'toc'

        if (options.target = 'epub') {
          properties['epub:type'] = 'toc'
        }

        const data = node.data || (node.data = {})
        data.hName = 'nav'
        data.hProperties = h('nav', properties).properties
      }
    })
  }
}
