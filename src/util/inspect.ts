/**
 * Checks if the given argument is a simple JavaScript object.
 * @param {any} obj - The object to test.
 * @returns {boolean} `true` if the argument is a plain object, otherwise `false`.
 */
export function isPlainObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
