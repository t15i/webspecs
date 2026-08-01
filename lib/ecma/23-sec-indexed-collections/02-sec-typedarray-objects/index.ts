const TypedArray = Object.getPrototypeOf(Int8Array) as abstract new (
  ...args: never[]
) => object;

/**
 * True for an Object with a [[TypedArrayName]] internal slot, i.e. any typed
 * array instance (Int8Array … Float64Array, BigInt64Array, BigUint64Array).
 * They all inherit from the %TypedArray% intrinsic, which is
 * `Object.getPrototypeOf(Int8Array)`.
 *
 * @see https://tc39.es/ecma262/#sec-typedarray-objects
 */
export function hasTypedArrayNameInternalSlot(v: unknown): boolean {
  return v instanceof TypedArray;
}
