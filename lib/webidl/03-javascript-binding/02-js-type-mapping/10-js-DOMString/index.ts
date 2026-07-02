import {
  type DOMStringType,
  isAnnotatedWithExtAttribute,
  LegacyNullToEmptyString,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-DOMString */
export function asDOMString(this: DOMStringType, v: unknown): string {
  if (
    v === null &&
    isAnnotatedWithExtAttribute(this, LegacyNullToEmptyString)
  ) {
    return "";
  }
  return `${v}`;
}
