import { consola } from 'consola'

const loggedMessages: string[] = []

/**
 * Logs an error, showing its stack trace
 * @param error The native `Error` object
 */
export function logError (error: Error): void {
  consola.error(error)
}

/**
 * Logs a warning, de-duplicating it
 * @param message The warning message
 */
export function logWarning (message: string): void {
  if (!loggedMessages.includes(message)) {
    loggedMessages.push(message)
    consola.warn(message)
  }
}
