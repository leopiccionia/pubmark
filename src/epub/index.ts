import { EpubBuilder } from '@leopiccionia/epub-builder'
import type { Locale } from '@leopiccionia/epub-builder'

import { PubmarkContext } from '~/context'
import { generateCoverXhtml } from '~/epub/cover-xhtml'
import { saveEpub } from '~/epub/output'
import { extractSpine } from '~/epub/spine'
import { normalizeToc } from './toc'
import { compileSectionsToXhtml, compileIndexToXhtml } from '~/epub/xhtml'
import { getAssets, getCover, getSections } from '~/input/glob'
import { extractSections } from '~/input/toc'
import { getCoreStyleAssets } from '~/output/styles'
import { getCoreAssetPath } from '~/output/targets'
import { readTextFile } from '~/utils/files'

/**
 * Generates and outputs an EPUB from a Pubmark project folder
 * @param folder The Pubmark project folder
 */
export async function generateEpub (folder: string): Promise<void> {
  const ctx = await PubmarkContext.init(folder)

  const assets = await getAssets(ctx)
  const coverPath = await getCover(ctx)
  const sections = await getSections(ctx)

  const index = await readTextFile(ctx.resolvePath('README.md'))
  const toc = extractSections(index).map(normalizeToc)
  const spine = extractSpine(toc, Boolean(coverPath))

  const builder = await EpubBuilder.init({
    locale: ctx.locale as Locale,
    meta: ctx.config,
    spine,
    toc,
    landmarks: {
      toc: 'index.xhtml#toc',
      bodymatter: 'index.xhtml#pubmark-content',
    },
  })

  await builder.addTextFile('index.xhtml', await compileIndexToXhtml(ctx))

  for (const { content, href } of await compileSectionsToXhtml(ctx, sections)) {
    await builder.addTextFile(href, content)
  }

  for (const style of getCoreStyleAssets('epub')) {
    await builder.copyFile(`assets/${style}`, getCoreAssetPath(style))
  }

  for (const asset of assets) {
    await builder.copyFile(asset, ctx.resolvePath(asset))
  }

  if (coverPath) {
    const cover = await builder.copyFile(coverPath, ctx.resolvePath(coverPath), ['cover-image'])
    await builder.addTextFile('cover.xhtml', await generateCoverXhtml(ctx, cover))
  }

  const epub = await builder.seal()
  await saveEpub(ctx, epub)
}
