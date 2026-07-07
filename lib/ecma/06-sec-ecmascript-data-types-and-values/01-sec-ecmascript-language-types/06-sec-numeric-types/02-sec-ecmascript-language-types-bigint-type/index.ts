/** @see https://tc39.es/ecma262/#sec-ecmascript-language-types-bigint-type */
export function isBigInt(v: unknown): v is bigint {
  return typeof v === "bigint";
}
