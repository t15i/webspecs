import { canonicalNumericIndexString } from "@ecma";

/** @see https://webidl.spec.whatwg.org/#is-an-array-index */
export function isArrayIndex(p: string | symbol): boolean {
  if (typeof p !== "string") {
    return false;
  }

  const index = canonicalNumericIndexString(p);

  if (index === undefined) {
    return false;
  }

  if (Number.isInteger(index) === false) {
    return false;
  }

  if (Object.is(index, -0)) {
    return false;
  }

  if (index < 0) {
    return false;
  }

  if (index >= 4294967295) {
    return false;
  }

  return true;
}
