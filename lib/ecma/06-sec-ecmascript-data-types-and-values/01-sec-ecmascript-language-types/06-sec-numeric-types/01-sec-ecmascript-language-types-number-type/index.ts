/** @see https://tc39.es/ecma262/#sec-ecmascript-language-types-number-type */
export function isNumber(v: unknown): v is number {
  return typeof v === "number";
}
