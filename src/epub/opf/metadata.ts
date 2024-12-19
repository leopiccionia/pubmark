import type { Element } from 'xast'
import { x } from 'xastscript'

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
 * @param config The user config
 * @returns The generated XML tree
 */
export function generateMetadata (config: PubmarkConfig): Element {
  const { id: pubId, onix } = getUniqueIdentifier(config)

  return x('metadata', { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/' }, [
    x('dc:identifier', { id: PUB_ID }, pubId),
    x('dc:title', config.title),
    x('dc:description', config.description),
    x('dc:language', config.language),
    x('metadata', { refines: `#${PUB_ID}`, property: 'identifier-type', scheme: 'onix:codelist5' }, onix),
    ...generateCreators(config),
  ])
}

/**
 * Extracts the package's DublinCore unique identifier from config
 * @param config The user config
 * @return
 */
function getUniqueIdentifier (config: PubmarkConfig): UniqueIdentifier {
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
