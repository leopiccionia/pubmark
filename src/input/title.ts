import type { Text } from 'mdast'
import { select } from 'unist-util-select'

import { parseMarkdown } from '@/input/markdown'

/**
 * Extracts the section title from heading
 * @param source The Markdown source code
 * @returns The section title, or `undefined` if not found
 */
export function extractTitle (source: string): string | undefined {
  const tree = parseMarkdown(source)

  const headingText = select('heading[depth="1"] text', tree) as Text | undefined
  return headingText?.value ?? undefined
}
