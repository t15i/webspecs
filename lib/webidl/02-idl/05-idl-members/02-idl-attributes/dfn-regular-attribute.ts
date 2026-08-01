import { isStaticAttribute, type Attribute, type Type } from "@webidl";

import { regularAttributeExtraValidationRules } from "./regular-attribute-extra-validation-rules";

/** @see https://webidl.spec.whatwg.org/#dfn-regular-attribute */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegularAttribute<T extends Type = Type> extends Attribute<T> {}

/** @see https://webidl.spec.whatwg.org/#dfn-regular-attribute */
export function isRegularAttribute(attribute: Attribute): boolean {
  return !isStaticAttribute(attribute);
}

export { regularAttributeExtraValidationRules };

export function validateRegularAttribute(attribute: RegularAttribute): void {
  for (const rule of regularAttributeExtraValidationRules) {
    rule(attribute);
  }
}
