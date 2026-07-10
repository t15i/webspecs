import { isStaticAttribute } from "@webidl";
import type { Attribute } from "./dfn-attribute";

/** @see https://webidl.spec.whatwg.org/#dfn-regular-attribute */
export function isRegularAttribute(attribute: Attribute): boolean {
  return !isStaticAttribute(attribute);
}
