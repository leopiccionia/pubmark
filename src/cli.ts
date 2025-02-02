#!/usr/bin/env node

import { defineCommand, runMain } from 'citty'

import epub from '~/cli/epub'

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
