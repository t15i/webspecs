import type { Attribute } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-static-attribute */
export function isStaticAttribute(attr: Attribute): boolean {
  return attr.keywords.has("static");
}
