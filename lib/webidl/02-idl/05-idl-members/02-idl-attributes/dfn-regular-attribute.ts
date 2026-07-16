import {
  isStaticAttribute,
  type Attribute,
  type RegularAttributeExtendedAttributes,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-regular-attribute */
export interface RegularAttribute<T extends Type = Type> extends Attribute<T> {
  extendedAttributes: RegularAttributeExtendedAttributes;
}

/** @see https://webidl.spec.whatwg.org/#dfn-regular-attribute */
export function isRegularAttribute(attribute: Attribute): boolean {
  return !isStaticAttribute(attribute);
}
