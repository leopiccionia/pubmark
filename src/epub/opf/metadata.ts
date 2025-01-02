import type { Element } from 'xast'
import { x } from 'xastscript'

import type { PubmarkContext } from '@/context'
import type { Resource } from '@/epub/resource'
import type { PubmarkConfig } from '@/input/config'

export const PUB_ID: string = 'pub-id'

/**
 * An unique identifier for use in DublinCore
 */
interface UniqueIdentifier {
  /**
   * The identifier
   */
  id: string,
  /**
   * The identifier type
   * @see https://ns.editeur.org/onix/en/5
   */
  onix: string,
}

/**
 * Generates the package's creators metadata
 * @param config The user config
 * @returns The generated list of XML trees
 */
function generateCreators (config: PubmarkConfig): Element[] {
  return config.creators.flatMap((creator, index) => {
    const id = `creators-${index + 1}`
    const dcTag = ['aut', 'dub'].includes(creator.role) ? 'dc:creator' : 'dc:contributor'

    const creatorMeta = [
      x(dcTag, { id }, creator.name),
      x('meta', { refines: `#${id}`, property: 'role', scheme: 'marc:relators' }, creator.role)
    ]

    if (creator['file as']) {
      creatorMeta.push(
        x('meta', { refines: `#${id}`, property: 'file-as' }, creator['file as'])
      )
    }

    if (creator.alternate) {
      for (const [lang, alias] of Object.entries(creator.alternate)) {
        x('meta', { refines: `#${id}`, property: 'alternate-script', 'xml:lang': lang }, alias)
      }
    }

    return creatorMeta
  })
}

/**
 * Generates the package's `<metadata>` section
 * @param ctx The Pubmark execution context
 * @param cover The cover's resource
 * @returns The generated XML tree
 */
export async function generateMetadata (ctx: PubmarkContext, cover: Resource | undefined): Promise<Element> {
  const { config } = ctx
  const { id: pubId, onix } = getUniqueIdentifier(config)

  return x('metadata', { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/', 'xmlns:opf': 'http://www.idpf.org/2007/opf' }, [
    x('dc:identifier', { id: PUB_ID }, pubId),
    x('dc:title', { id: 'title' }, config.title),
    config.subtitle
      ? x(null, [
        x('dc:title', { id: 'subtitle' }, config.subtitle),
        x('meta', { refines: '#subtitle', property: 'title-type' }, 'subtitle'),
      ])
      : null,
    config.description ? x('dc:description', config.description) : null,
    config.publisher.name ? x('dc:publisher', config.publisher.name) : null,
    x('dc:language', config.language),
    x('meta', { property: 'dcterms:modified' }, getTimestamp()),
    x('meta', { refines: `#${PUB_ID}`, property: 'identifier-type', scheme: 'onix:codelist5' }, onix),
    cover && x('meta', { name: 'cover', content: cover.href }),
    ...generateCreators(config),
  ])
}

/**
 * Returns the timestamp, in `CCYY-MM-DDThh:mm:ssZ` format
 */
function getTimestamp (): string {
  const isoString = new Date().toISOString()
  return isoString.slice(0, 19) + 'Z'
}

/**
 * Extracts the package's DublinCore unique identifier from config
 * @param config The user config
 */
export function getUniqueIdentifier (config: PubmarkConfig): UniqueIdentifier {
  const { doi, isbn, uuid } = config.ids
  if (isbn) {
    const onix = isbn.length > 10 ? '15' : '02'
    return { id: `urn:isbn:${isbn}`, onix }
  } else if (doi) {
    return { id: `urn:isbn:${doi}`, onix: '06' }
  } else {
    return { id: `urn:isbn:${uuid}`, onix: '01' }
  }
}
