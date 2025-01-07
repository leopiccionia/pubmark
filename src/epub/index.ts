import { PubmarkContext } from '~/context'
import { EpubContainer } from '~/epub/container'
import { generateCoverXhtml } from '~/epub/cover-xhtml'
import { generateNavXhtml } from '~/epub/nav-xhtml'
import { generateNcx } from '~/epub/ncx'
import { saveEpub } from '~/epub/output'
import { BinaryResource, TextResource } from '~/epub/resource'
import { compileSectionsToXhtml, compileIndexToXhtml } from '~/epub/xhtml'
import { getAssets, getCover, getSections } from '~/input/glob'
import { getCoreStyleAssets } from '~/output/styles'
import { getCoreAssetPath } from '~/output/targets'

/**
 * Generates and outputs an EPUB from a Pubmark project folder
 * @param folder The Pubmark project folder
 */
export async function generateEpub (folder: string): Promise<void> {
  const ctx = new PubmarkContext(folder)
  await ctx.initialize()

  const assets = await getAssets(ctx)
  const coverPath = await getCover(ctx)
  const sections = await getSections(ctx)

  const container = new EpubContainer(ctx)
  await container.initialize()

  await container.addResource(new TextResource('nav.xhtml', await generateNavXhtml(ctx), 'nav'))
  await container.addResource(new TextResource('toc.ncx', await generateNcx(ctx)))
  await container.addResource(new TextResource('index.xhtml', await compileIndexToXhtml(ctx)))

  for (const { content, href } of await compileSectionsToXhtml(ctx, sections)) {
    await container.addResource(new TextResource(href, content))
  }

  for (const style of getCoreStyleAssets('epub')) {
    await container.addResource(await TextResource.fromFile(getCoreAssetPath(style), `assets/${style}`))
  }

  for (const asset of assets) {
    await container.addResource(await BinaryResource.fromFile(ctx.resolvePath(asset), asset))
  }

  if (coverPath) {
    const cover = await BinaryResource.fromFile(ctx.resolvePath(coverPath), coverPath, 'cover-image')
    await container.addResource(cover)
    await container.addResource(new TextResource('cover.xhtml', await generateCoverXhtml(ctx, cover)))
  }

  const epub = await container.seal()
  await saveEpub(ctx, epub)
}
