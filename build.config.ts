import { fileURLToPath } from 'node:url'

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/cli',
    './src/index',
    { builder: 'copy', input: './src/static', outDir: './dist/static' },
  ],
  alias: {
    '~': fileURLToPath(new URL('src', import.meta.url)),
  },
  declaration: true,
  failOnWarn: false,
})
