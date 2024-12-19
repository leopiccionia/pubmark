import { getMimeType, isValidMediaType } from '@/input/mime'

import { expect, describe, it } from 'vitest'

describe('Get MIME types', () => {
  it('Images', () => {
    expect(getMimeType('image.gif')).toBe('image/gif')
    expect(getMimeType('image.jpg')).toBe('image/jpeg')
    expect(getMimeType('image.jpeg')).toBe('image/jpeg')
    expect(getMimeType('image.png')).toBe('image/png')
    expect(getMimeType('image.svg')).toBe('image/svg+xml')
    expect(getMimeType('image.webp')).toBe('image/webp')
  })

  it('Audio', () => {
    expect(getMimeType('audio.mp3')).toBe('audio/mpeg')
    expect(getMimeType('audio.mp4')).toBe('audio/mp4')
    expect(getMimeType('audio.oga')).toBe('audio/ogg')
    expect(getMimeType('audio.ogg')).toBe('audio/ogg')
  })

  it('Style', () => {
    expect(getMimeType('style.css')).toBe('text/css')
  })

  it('Fonts', () => {
    expect(getMimeType('font.otf')).toBe('font/otf')
    expect(getMimeType('font.ttf')).toBe('font/ttf')
    expect(getMimeType('font.woff')).toBe('font/woff')
    expect(getMimeType('font.woff2')).toBe('font/woff2')
  })

  it('Miscellaneous', () => {
    expect(getMimeType('script.js')).toBe('application/javascript')
    expect(getMimeType('toc.ncx')).toBe('application/x-dtbncx+xml')
    expect(getMimeType('overlay.smil')).toBe('application/smil+xml')
    expect(getMimeType('index.xhtml')).toBe('application/xhtml+xml')
  })

  it('Invalid', () => {
    expect(getMimeType('image-jpg')).toBeUndefined()
    expect(getMimeType('format.invalid')).toBeUndefined()
  })
})

describe('Validate media types', () => {
  it('Images', () => {
    expect(isValidMediaType('image.gif')).toBe(true)
    expect(isValidMediaType('image.jpg')).toBe(true)
    expect(isValidMediaType('image.png')).toBe(true)
    expect(isValidMediaType('image.svg')).toBe(true)
    expect(isValidMediaType('image.webp')).toBe(true)

    expect(getMimeType('image.avif')).toBe('image/avif')
    expect(isValidMediaType('image.avif')).toBe(false)

    expect(getMimeType('image.bmp')).toBe('image/bmp')
    expect(isValidMediaType('image.bmp')).toBe(false)
  })

  it('Audio', () => {
    expect(isValidMediaType('audio.mp3')).toBe(true)
    expect(isValidMediaType('audio.mp4')).toBe(true)
    expect(isValidMediaType('audio.ogg')).toBe(true)

    expect(getMimeType('audio.aac')).toBe('audio/aac')
    expect(isValidMediaType('audio.aac')).toBe(false)

    expect(getMimeType('audio.mid')).toBe('audio/midi')
    expect(isValidMediaType('audio.mid')).toBe(false)

    expect(getMimeType('audio.wav')).toBe('audio/wav')
    expect(isValidMediaType('audio.wav')).toBe(false)
  })

  it('Video', () => {
    expect(getMimeType('video.avi')).toBe('video/x-msvideo')
    expect(isValidMediaType('video.avi')).toBe(false)

    expect(getMimeType('video.mpeg')).toBe('video/mpeg')
    expect(isValidMediaType('video.mpeg')).toBe(false)

    expect(getMimeType('video.webm')).toBe('video/webm')
    expect(isValidMediaType('video.webm')).toBe(false)
  })

  it('Style', () => {
    expect(isValidMediaType('style.css')).toBe(true)
  })

  it('Fonts', () => {
    expect(isValidMediaType('font.otf')).toBe(true)
    expect(isValidMediaType('font.ttf')).toBe(true)
    expect(isValidMediaType('font.woff')).toBe(true)
    expect(isValidMediaType('font.woff2')).toBe(true)
  })

  it('Miscellaneous', () => {
    expect(isValidMediaType('script.js')).toBe(true)
    expect(isValidMediaType('toc.ncx')).toBe(true)
    expect(isValidMediaType('overlay.smil')).toBe(true)
    expect(isValidMediaType('index.xhtml')).toBe(true)

    expect(getMimeType('book.epub')).toBe('application/epub+zip')
    expect(isValidMediaType('book.epub')).toBe(false)

    expect(getMimeType('virus.exe')).toBe('application/octet-stream')
    expect(isValidMediaType('virus.exe')).toBe(false)

    expect(getMimeType('index.html')).toBe('text/html')
    expect(isValidMediaType('index.html')).toBe(false)

    expect(getMimeType('book.pdf')).toBe('application/pdf')
    expect(isValidMediaType('book.pdf')).toBe(false)

    expect(getMimeType('data.xml')).toBe('application/xml')
    expect(isValidMediaType('data.xml')).toBe(false)

    expect(getMimeType('folder.zip')).toBe('application/zip')
    expect(isValidMediaType('folder.zip')).toBe(false)
  })

  it('Invalid', () => {
    expect(isValidMediaType('image-jpg')).toBe(false)
    expect(isValidMediaType('format.invalid')).toBe(false)
  })
})
