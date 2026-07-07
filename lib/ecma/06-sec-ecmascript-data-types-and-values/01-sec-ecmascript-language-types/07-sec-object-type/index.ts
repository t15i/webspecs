export * from "./property-key";
export * from "./property-name";

/** @see https://tc39.es/ecma262/#sec-object-type */
export function isObject(v: unknown): v is object {
  return (typeof v === "object" && v !== null) || typeof v === "function";
}
