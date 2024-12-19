import { u } from 'unist-builder'
import type { Element } from 'xast'
import { x } from 'xastscript'

import type { PubmarkConfig } from '@/input/config'
import { stringifyXml } from '@/utils/xml'

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
 * Generates a package document
 * @param config The user config
 * @returns The generated XML string
 */
export function generateContainerOpf (config: PubmarkConfig): string {
  const tree = x(null, [
    u('instruction', { name: 'xml' }, 'version="1.0"'),
    x('package', {
      dir: config.direction,
      'unique-identifier': 'pub-id',
      version: '3.0',
      'xml:lang': config.language,
      xmlns: 'http://www.idpf.org/2007/opf',
    }, [
      generatePackageMetadata(config),
      x('manifest', { }, []), // @TODO
      x('spine', { }, []), //@TODO
    ])
  ])

  return stringifyXml(tree)
}

/**
 * Generates the package's creators metadata
 * @param config The user config
 * @returns The generated list of XML trees
 */
function generateCreators (config: PubmarkConfig): Element[] {
  return config.creators.flatMap((creator, index) => {
    const id = `creators-${index + 1}`

    const creatorMeta = [
      x('dc:creator', { id }, creator.name),
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
export function generatePackageMetadata (config: PubmarkConfig): Element {
  const { id: pubId, onix } = getUniqueIdentifier(config)

  return x('metadata', { 'xmlns:dc': 'http://purl.org/dc/elements/1.1/' }, [
    x('dc:identifier', { id: 'pub-id' }, pubId),
    x('dc:title', config.title),
    x('dc:description', config.description),
    x('dc:language', config.language),
    x('metadata', { refines: '#pub-id', property: 'identifier-type', scheme: 'onix:codelist5' }, onix),
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
