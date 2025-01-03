import { fileURLToPath } from 'node:url'

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/cli',
    './src/index',
    { builder: 'copy', input: './src/templates', outDir: './dist/templates' },
    { builder: 'copy', input: './src/locales', outDir: './dist/locales' },
  ],
  alias: {
    '~': fileURLToPath(new URL('src', import.meta.url)),
  },
  declaration: true,
  failOnWarn: false,
})
