/**
 * Axios errors often include a message from our Express API.
 * This helper picks that message, or falls back to a friendly default.
 */
export function getErrorMessage(error, fallbackMessage) {
  const fromServer = error.response?.data?.error || error.response?.data?.message
  return fromServer || fallbackMessage
}
