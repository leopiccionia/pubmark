import type { Root } from 'mdast'
import remarkCustomHeaderId from 'remark-custom-header-id'
import remarkDirective from 'remark-directive'
import remarkExtendedTable from 'remark-extended-table'
import remarkGfm from 'remark-gfm'
import remarkImages from 'remark-images'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import type { Processor } from 'unified'

/**
 * Configures the Markdown parser with the default plugins
 * @returns The Markdown parser
 */
export function createBaseMarkdownParser (): Processor<Root, Root> {
  const parser = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCustomHeaderId)
    .use(remarkGfm)
    .use(remarkExtendedTable)
    .use(remarkImages)
    .use(remarkMath)
  return parser
}

/**
 * Converts a Markdown input into a Markdown AST
 * @param path The Markdown source code
 * @returns The Markdown AST
 */
export function parseMarkdown (source: string): Root {
  const result = createBaseMarkdownParser()
    .parse(source)

  return result
}
