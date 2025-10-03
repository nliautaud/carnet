// Compression utilities for URI-safe encoding/decoding
// Uses: lz-string
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

// Generic compress: returns URI-safe string
export function compress(str) {
  return compressToEncodedURIComponent(str)
}

// Generic decompress: takes URI-safe string
export function decompress(uriEncoded) {
  return decompressFromEncodedURIComponent(uriEncoded)
}
