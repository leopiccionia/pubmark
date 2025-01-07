import rehypeMathJax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'

import type { PubmarkContext } from '~/context'
import { createBaseMarkdownParser } from '~/input/markdown'
import { directivesPlugin } from '~/input/plugins/directives'
import { rewriteUrlPlugin } from '~/input/plugins/url-rewrite'
import { extractTitle } from '~/input/title'
import { getStyleAssets } from '~/output/styles'
import { readTextFile } from '~/utils/files'
import { generateItemId, replaceExtension } from '~/utils/paths'
import { createTemplate } from '~/utils/templates'

/**
 * A parsed section
 */
interface ParsedSection {
  /**
   * The section's path
   */
  href: string
  /**
   * The section's compiled content
   */
  content: string
}

/**
 * Compiles the index document into XHTML
 * @param ctx The Pubmark execution context
 * @returns The XHTML string
 */
export async function compileIndexToXhtml(ctx: PubmarkContext): Promise<string> {
  const template = await createTemplate('epub-index.html', ['bodyClass', 'config', 'content', 'styles', 'title'] as const)
  const source = await readTextFile(ctx.resolvePath('README.md'))
  const document = template({
    bodyClass: 'README-md',
    config: ctx.config,
    content: await compileSection(source),
    styles: await getStyleAssets(ctx, 'epub'),
    title: undefined,
  })
  return document
}

/**
 * Compiles the section into XHTML
 * @param source The Markdown source code
 * @returns The XHTML string
 */
async function compileSection (source: string): Promise<string> {
  const content = await createBaseMarkdownParser()
    .use(rewriteUrlPlugin, { extension: '.xhtml' })
    .use(directivesPlugin)
    .use(remarkRehype, { clobberPrefix: '' })
    .use(rehypeMathJax)
    .use(rehypeStringify, {
      closeEmptyElements: true,
      space: 'svg',
    })
    .process(source)

  return String(content)
}

/**
 * Compiles the sections into XHTML
 * @param ctx The Pubmark execution context
 * @param sections A list of section paths
 * @returns A list of compiled sections
 */
export async function compileSectionsToXhtml(ctx: PubmarkContext, sections: string[]): Promise<ParsedSection[]> {
  const template = await createTemplate('epub-section.html', ['bodyClass', 'config', 'content', 'styles', 'title'] as const)
  const styles = await getStyleAssets(ctx, 'epub')

  return Promise.all(sections.map(async (section) => {
    const source = await readTextFile(ctx.resolvePath(section))
    const document = template({
      bodyClass: generateItemId(section),
      config: ctx.config,
      content: await compileSection(source),
      styles,
      title: extractTitle(source),
    })
    return { href: replaceExtension(section, '.xhtml'), content: document }
  }))
}
