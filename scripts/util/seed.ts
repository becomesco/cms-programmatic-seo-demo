/**
 * @typedef {{
 *  string: string;
 * }} () => number
 */

export function Seed(str: string): () => number {
  let i = 0;
  let hash = 0;
  for (hash = 1779033703 ^ str.length; i < str.length; i++) {
    const bitwise_xor_from_character = hash ^ str.charCodeAt(i);
    hash = Math.imul(bitwise_xor_from_character, 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return () => {
    // Return the hash that you can use as a seed
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}
