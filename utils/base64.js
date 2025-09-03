/**
 * Converts a Buffer to a Base64URL string.
 * This is the standard encoding for WebAuthn.
 * @param {Buffer} buffer The buffer to convert.
 * @returns {string} The Base64URL encoded string.
 */
export function toBase64url(buffer) {
  // Replace characters not allowed in Base64URL
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Converts a Base64URL string to a Buffer.
 * @param {string} str The Base64URL string to convert.
 * @returns {Buffer} The resulting buffer.
 */
export function fromBase64url(str) {
  // Convert back to standard Base64 before converting to Buffer
  const base64Str = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64Str, "base64");
}
