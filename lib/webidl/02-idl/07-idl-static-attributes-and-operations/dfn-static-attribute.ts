import type {
  Attribute,
  StaticAttributeExtendedAttributes,
  Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-static-attribute */
export interface StaticAttribute<T extends Type = Type> extends Attribute<T> {
  extendedAttributes: StaticAttributeExtendedAttributes;
}

/** @see https://webidl.spec.whatwg.org/#dfn-static-attribute */
export function isStaticAttribute(attribute: Attribute): boolean {
  return attribute.keywords.has("static");
}
