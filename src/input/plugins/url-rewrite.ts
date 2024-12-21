/// <reference types="mdast-util-to-hast" />
/// <reference types="mdast-util-directive" />

import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Options for URL rewriting plugin
 */
interface RewriteUrlOptions {
  /**
   * The new file extension, with leading dot
   */
  extension: string
}

export function rewriteUrlPlugin (options: RewriteUrlOptions) {
  return function (tree: Root) {
    visit(tree, (node) => {
      if (node.type === 'link') {
        if (node.url.match(/\.md/)) {
          node.url = node.url.replace('.md', options.extension)
        }
      }
    })
  }
}
