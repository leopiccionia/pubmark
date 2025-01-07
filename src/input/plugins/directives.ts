/// <reference types="mdast-util-to-hast" />
/// <reference types="mdast-util-directive" />

import type { Properties } from 'hast'
import type { Node, Paragraph, Root } from 'mdast'
import type { ContainerDirective } from 'mdast-util-directive'
import { selectAll } from 'unist-util-select'
import { visit } from 'unist-util-visit'

/**
 * Transforms a container directive according to passed params
 * @param node The directive's AST node
 * @param tag The HTML tag
 * @param className The HTML `class` attribute
 * @param attributes Other HTML attributes
 */
function transformContainer (node: ContainerDirective, tag: string, className: string = '', attributes: Properties = {}): void {
  const properties = { ...node.attributes ?? (node.attributes = {}), ...attributes }
  properties.class = [properties.class, className].filter(Boolean).join(' ')
  transformNode(node, tag, properties)
}

function transformFigure (node: ContainerDirective): void {
  transformContainer(node, 'figure')

  const images = selectAll('image', node) as Paragraph[] /* Pretend to be a paragraph to appease TS */
  if (images.length !== 1) {
    throw new Error(`A \`::figure\` block should contain exactly 1 image, ${images.length} found`)
  }

  const captions = selectAll('paragraph:has(text)', node) as Paragraph[]
  if (captions.length !== 1) {
    throw new Error(`A \`::figure\` block should contain exactly 1 caption, ${captions.length} found`)
  }
  transformNode(captions[0], 'figcaption')

  node.children = [images[0], captions[0]]
}

/**
 * Transforms an AST node according to passed params
 * @param node The AST node
 * @param tag The HTML tag
 * @param className The HTML `class` attribute
 * @param attributes Other HTML attributes
 */
function transformNode (node: Node, tag: string | undefined, attributes: Properties = {}): void {
  const data = node.data ?? (node.data = {})
  const properties = data.hProperties ?? (data.hProperties = {})
  data.hName = tag
  data.hProperties = { ...properties, ...attributes }
}

/**
 * The `toc` directive plugin
 * @param options The plugin options
 * @returns The Remark plugin
 */
export function directivesPlugin () {
  return function (tree: Root) {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        if (node.name === 'figure') {
          transformFigure(node)
        } else if (node.name === 'toc') {
          transformContainer(node, 'nav', 'toc', { id: 'toc' })
        }
      }
    })
  }
}
