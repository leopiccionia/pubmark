import { cwd } from 'node:process'

import { generateEpub } from '@/epub'

async function main () {
  const folder = cwd()

  await generateEpub(folder)
}

main()
