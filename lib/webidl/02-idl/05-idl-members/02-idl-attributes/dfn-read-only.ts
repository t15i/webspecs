import type { Attribute } from "./dfn-attribute";

/** @see https://webidl.spec.whatwg.org/#dfn-read-only*/
export function isReadonlyAttribute(attribute: Attribute): boolean {
  return attribute.keywords.has("readonly");
}
