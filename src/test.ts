import { resolve } from 'node:path'
import { cwd } from 'node:process'

import { extractSections } from '@/input/toc'
import { readTextFile } from '@/utils/files'

async function main () {
  const source = await readTextFile(resolve(cwd(), './README.md'))

  const links = extractSections(source)
  console.log(JSON.stringify(links, null, 2))
}

main()
