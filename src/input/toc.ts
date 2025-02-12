import type { TocEntry } from '@leopiccionia/epub-builder'
import type { Link, List } from 'mdast'
import { toString } from 'mdast-util-to-string'
import remarkDirective from 'remark-directive'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { select, selectAll } from 'unist-util-select'

/**
 * Extracts a list of links from Markdown
 * @param source The Markdown source code
 * @returns A list of links
 */
function extractNestedSections (list: List): TocEntry[] {
  const items = selectAll(':root > listItem', list)

  return items.map((item) => {
    const link = select(':root > paragraph > link', item) as Link | undefined
    if (!link) {
      return null
    }

    const childList = select(':root > list', item) as List | undefined

    return {
      href: link.url,
      text: toString(link),
      children: childList ? extractNestedSections(childList) : [],
    }
  }).filter(Boolean) as TocEntry[]
}

/**
 * Extracts a list of links from Markdown
 * @param source The Markdown source code
 * @returns A list of links
 */
export function extractSections (source: string): TocEntry[] {
  const rootList = selectTocList(source)
  if (!rootList) {
    return []
  }

  return extractNestedSections(rootList)
}

/**
 * Parses a Markdown file, extracting the table of content
 * @param source The Markdown source code
 * @returns The list AST node
 */
function selectTocList (source: string): List | undefined {
  const tree = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .parse(source)

  const list = select('containerDirective[name="toc"] > list', tree) as List | undefined

  return list
}
