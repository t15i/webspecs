import { type InterfaceType, type NullableType } from "@webidl";

import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTargetAssociations as BaseReflectedTargetAssociations } from "./reflected-target";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ReflectedTargetAssociations<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  E extends Element,
> extends BaseReflectedTargetAssociations {}

export type ReflectedIDLAttribute<E extends Element> =
  BaseReflectedIDLAttribute<NullableType<InterfaceType<E>>>;

export function getter<E extends Element>(
  this: ReflectedTargetAssociations<E>,
  reflectedIDLAttribute: ReflectedIDLAttribute<E>,
  reflectedContentAttributeName: string,
): E | null {
  return this.getAssociatedElement(
    reflectedIDLAttribute,
    reflectedContentAttributeName,
  );
}

export function setter<E extends Element>(
  this: ReflectedTargetAssociations<E>,
  _: ReflectedIDLAttribute<E>,
  reflectedContentAttributeName: string,
  value: E | null,
): void {
  if (value === null) {
    this.explicitlySetElement = null;
    this.deleteContentAttribute(reflectedContentAttributeName);
    return;
  }

  this.setContentAttribute(reflectedContentAttributeName, "");
  this.explicitlySetElement = new WeakRef(value);
}

export function attributeChangeSteps<E extends Element>(
  this: ReflectedTargetAssociations<E>,
  _: ReflectedIDLAttribute<E>,
  reflectedContentAttributeName: string,
  __: E,
  localName: string,
  ___: string | null,
  ____: string | null,
  namespace: string | null,
): void {
  if (localName !== reflectedContentAttributeName || namespace !== null) {
    return;
  }

  this.explicitlySetElement = null;
}
