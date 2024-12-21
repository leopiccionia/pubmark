import rehypeFigure from '@microflash/rehype-figure'
import rehypeMathJax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'

import type { PubmarkConfig } from '@/input/config'
import { createBaseMarkdownParser } from '@/input/markdown'
import { tocDirectivePlugin } from '@/input/plugins/toc'
import { rewriteUrlPlugin } from '@/input/plugins/url-rewrite'
import { extractTitle } from '@/input/title'
import { readTextFile } from '@/utils/files'
import { generateItemId, replaceExtension, resolvePath } from '@/utils/paths'
import { createTemplate } from '@/utils/templates'

/**
 * A parsed section
 */
interface ParsedSection {
  /**
   * The section's path
   */
  path: string
  /**
   * The section's compiled content
   */
  content: string
}

/**
 * Compiles the index document into XHTML
 * @param folder The Pubmark project folder
 * @param config The user config
 * @returns The XHTML string
 */
export async function compileIndexToXhtml(folder: string, config: PubmarkConfig): Promise<string> {
  const template = await createTemplate('epub-index.html', ['bodyClass', 'config', 'content', 'title'] as const)
  const source = await readTextFile(resolvePath(folder, 'README.md'))
  const document = template({
    bodyClass: 'README-md',
    config,
    content: await compileSection(source, true),
    title: undefined,
  })
  return document
}

/**
 * Compiles the section into XHTML
 * @param source The Markdown source code
 * @param isToc If this section is the table of contents
 * @returns The XHTML string
 */
async function compileSection (source: string, isToc: boolean = false): Promise<string> {
  const parser = createBaseMarkdownParser()

  if (isToc) {
    parser.use(rewriteUrlPlugin, { extension: '.xhtml' })
    parser.use(tocDirectivePlugin)
  }

  const content = await parser
    .use(remarkRehype, { clobberPrefix: '' })
    .use(rehypeFigure)
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
 * @param folder The Pubmark project folder
 * @param sections A list of section paths
 * @param config The user config
 * @returns A list of compiled sections
 */
export async function compileSectionsToXhtml(folder: string, sections: string[], config: PubmarkConfig): Promise<ParsedSection[]> {
  const template = await createTemplate('epub-section.html', ['bodyClass', 'config', 'content', 'title'] as const)

  return Promise.all(sections.map(async (section) => {
    const source = await readTextFile(resolvePath(folder, section))
    const document = template({
      bodyClass: generateItemId(section),
      config,
      content: await compileSection(source, false),
      title: extractTitle(source),
    })
    return { path: replaceExtension(section, '.xhtml'), content: document }
  }))
}
