/**
 * True for an Object with a [[DataView]] internal slot, i.e. a DataView
 * instance.
 *
 * @see https://tc39.es/ecma262/#sec-dataview-objects
 */
export function hasDataViewInternalSlot(v: unknown): boolean {
  return v instanceof DataView;
}
