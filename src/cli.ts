#!/usr/bin/env node

import { cwd } from 'node:process'

import { defineCommand, runMain } from 'citty'

import { generateEpub } from '~/index'
import { logError } from '~/utils/console'

const epub = defineCommand({
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

const main = defineCommand({
  meta: {
    name: 'pubmark',
    version: '0.0.1',
    description: 'Zen-mode authoring of EPUB in Markdown',
  },
  subCommands: {
    epub,
  },
})

runMain(main)
