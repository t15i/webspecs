import type { Attribute } from "./dfn-attribute";

/** @see https://webidl.spec.whatwg.org/#dfn-regular-attribute */
export function isRegularAttribute(attribute: Attribute<unknown>): boolean {
  return !attribute.keywords.has("static");
}

export function isStaticAttribute(attribute: Attribute<unknown>): boolean {
  return attribute.keywords.has("static");
}
