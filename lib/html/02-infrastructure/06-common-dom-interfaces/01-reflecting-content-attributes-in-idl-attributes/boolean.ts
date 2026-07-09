import type { BooleanType } from "@webidl";

import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTargetAssociations } from "./reflected-target";

export type ReflectedIDLAttribute = BaseReflectedIDLAttribute<BooleanType>;

export type { ReflectedTargetAssociations };

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
