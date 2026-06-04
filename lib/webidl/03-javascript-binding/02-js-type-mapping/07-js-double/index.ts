/** @see https://webidl.spec.whatwg.org/#js-double */
export function Double(value: unknown): number {
  const x = Number(value);

  if (!isFinite(x)) {
    throw TypeError("The provided double value is non-finite");
  }

  return x;
}
