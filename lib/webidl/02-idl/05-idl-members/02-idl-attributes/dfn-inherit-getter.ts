import type { Attribute } from "./dfn-attribute";

/** @see https://webidl.spec.whatwg.org/#dfn-inherit-getter*/
export function isDeclaredToInheritItsGetterAttribute(
  attribute: Attribute<unknown>,
): boolean {
  return !attribute.keywords.has("inherit");
}
