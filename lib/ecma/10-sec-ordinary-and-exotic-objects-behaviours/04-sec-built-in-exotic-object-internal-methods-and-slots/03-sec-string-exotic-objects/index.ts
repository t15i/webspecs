/** @see https://tc39.es/ecma262/#sec-string-exotic-objects */
export function hasStringDataInternalSlot(v: unknown): boolean {
  return v instanceof String;
}
