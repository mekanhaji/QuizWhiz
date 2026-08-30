// FNV-1a 32-bit. Synchronous and dependency-free so parseQuizQuestions stays sync;
// crypto.subtle.digest is async and would force every caller to become async too.
export function questionKey(text: string): string {
  const norm = text.trim().toLowerCase().replace(/\s+/g, " ");
  let h = 0x811c9dc5;
  for (let i = 0; i < norm.length; i++) {
    h ^= norm.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}
