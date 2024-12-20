import rehypeFigure from '@microflash/rehype-figure'
import rehypeMathJax from 'rehype-mathjax'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'

import type { PubmarkConfig } from '@/input/config'
import { createBaseMarkdownParser } from '@/input/markdown'
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
 * Converts the section into XHTML
 * @param folder The Pubmark project folder
 * @param path The file path
 * @param source The Markdown source code
 * @param config The user config
 * @returns The XHTML string
 */
async function compileSection (source: string): Promise<string> {
  const content = await createBaseMarkdownParser()
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
 * Convert the sections into XHTML
 * @param folder The Pubmark project folder
 * @param sections A list of section paths
 * @param config The user config
 * @returns A list of compiled sections
 */
export async function compileSectionsToXhtml(folder: string, sections: string[], config: PubmarkConfig): Promise<ParsedSection[]> {
  const template = await createTemplate('epub-section.html', ['bodyClass', 'config', 'content', 'title'] as const)

  return Promise.all(sections.map(async (section) => {
    const source = await readTextFile(resolvePath(folder, section))

    const bodyClass = generateItemId(section)
    const title = extractTitle(source)

    const content = await compileSection(source)
    const document = template({ bodyClass, config, content, title })
    return { path: replaceExtension(section, '.xhtml'), content: document }
  }))
}
