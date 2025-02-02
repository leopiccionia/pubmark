import { cwd } from 'node:process'

import { defineCommand } from 'citty'

import { generateEpub } from '~/epub'
import { logError } from '~/utils/console'

export default defineCommand({
  meta: {
    description: 'Generate EPUB file',
  },
  args: {
    output: {
      alias: 'o',
      description: 'Output path',
      type: 'string',
      valueHint: 'dist/book.epub',
    },
  },
  async run({ args }) {
    try {
      await generateEpub(cwd())
    } catch (err: unknown) {
      logError(err as Error)
    }
  },
})
