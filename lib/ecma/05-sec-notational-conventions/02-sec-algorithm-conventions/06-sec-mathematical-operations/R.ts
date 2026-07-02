/** @see https://tc39.es/ecma262/#%E2%84%9D */
export function R(x: number): number {
  if (!Number.isFinite(x)) {
    throw TypeError("The provided value is not a real number");
  }
  if (Object.is(x, -0)) return 0;
  return x;
}
