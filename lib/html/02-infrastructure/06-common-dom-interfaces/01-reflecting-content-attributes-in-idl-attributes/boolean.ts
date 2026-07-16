import type { BooleanType } from "@webidl";

import type { ReflectedIDLAttributeOf } from "./reflected-idl-attribute";
import type { ReflectedTargetAssociations } from "./reflected-target";

export type { ReflectedTargetAssociations };

export type ReflectedIDLAttribute = ReflectedIDLAttributeOf<BooleanType>;

export function getter(
  this: ReflectedTargetAssociations,
  _: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
): boolean {
  return this.getContentAttribute(reflectedContentAttributeName) !== null;
}

export function setter(
  this: ReflectedTargetAssociations,
  _: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
  value: boolean,
): void {
  if (value === false) {
    this.deleteContentAttribute(reflectedContentAttributeName);
  }

  if (value === true) {
    this.setContentAttribute(reflectedContentAttributeName, "");
  }
}
