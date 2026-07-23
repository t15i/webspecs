import { isStaticAttribute, type Attribute, type Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-regular-attribute */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegularAttribute<T extends Type = Type> extends Attribute<T> {}

/** @see https://webidl.spec.whatwg.org/#dfn-regular-attribute */
export function isRegularAttribute(attribute: Attribute): boolean {
  return !isStaticAttribute(attribute);
}

type RegularAttributeValidationRule = (attribute: RegularAttribute) => void;

export const regularAttributeExtraValidationRules: RegularAttributeValidationRule[] =
  [];

export function validateRegularAttribute(attribute: RegularAttribute): void {
  for (const rule of regularAttributeExtraValidationRules) {
    rule(attribute);
  }
}
