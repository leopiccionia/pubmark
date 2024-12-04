import { u } from 'unist-builder'
import { x } from 'xastscript'

import { printXml } from '@/utils/xml'

/**
 * Generates a basic OCF `container.xml`
 * @returns The generated XML string
 */
export function generateContainerXml (): string {
  const tree = x(null, [
    u('instruction', { name: 'xml' }, 'version="1.0"'),
    x('container', { version: '1.0', xmlns: 'urn:oasis:names:tc:opendocument:xmlns:container' }, [
      x('rootfiles', [
        x('rootfile', { 'full-path': 'PUBMARK/container.opf', 'media-type': 'application/oebps-package+xml' }),
      ]),
    ]),
  ])

  return printXml(tree)
}
