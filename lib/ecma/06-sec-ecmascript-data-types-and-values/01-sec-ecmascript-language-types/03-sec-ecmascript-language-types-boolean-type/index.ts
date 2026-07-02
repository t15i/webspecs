/** @see https://tc39.es/ecma262/#sec-ecmascript-language-types-boolean-type */
export function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}
