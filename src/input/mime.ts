import mime from 'mime'

const ALLOWED_MEDIA_TYPES: string[] = [
  // Images
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',

  // Audio
  'audio/mpeg',
  'audio/mp4',
  'audio/ogg',

  // Style
  'text/css',

  // Fonts
  'font/ttf',
  'font/otf',
  'font/woff',
  'font/woff2',

  // Other
  'application/xhtml+xml',
  'application/javascript',
  'application/x-dtbncx+xml',
  'application/smil+xml',
]

/**
 * Returns the MIME type of a certain file
 * @param path The file path
 * @returns The MIME type of the file, or `undefined` if not recognized
 */
export function getMimeType (path: string): string | undefined {
  const mimeType = mime.getType(path) ?? undefined
  if (mimeType === 'video/mp4') {
    return 'audio/mp4'
  } else if (mimeType === 'text/javascript') {
    return 'application/javascript'
  }
  return mimeType
}

/**
 * Returns if the given MIME type is a core media type
 * @param path The MIME type
 * @returns True if the media type is recognized and a core media type, false otherwise
 */
export function isCoreMediaType (mimeType: string | undefined): boolean {
  if (!mimeType) {
    return false
  }

  return ALLOWED_MEDIA_TYPES.includes(mimeType)
}
