/**
 * True for an Object with an [[ArrayBufferData]] internal slot, i.e. both
 * ArrayBuffer and SharedArrayBuffer instances (the slot is allocated for both
 * by AllocateArrayBuffer).
 *
 * @see https://tc39.es/ecma262/#sec-arraybuffer-objects
 */
export function hasArrayBufferDataInternalSlot(v: unknown): boolean {
  return (
    v instanceof ArrayBuffer ||
    (typeof SharedArrayBuffer !== "undefined" && v instanceof SharedArrayBuffer)
  );
}
