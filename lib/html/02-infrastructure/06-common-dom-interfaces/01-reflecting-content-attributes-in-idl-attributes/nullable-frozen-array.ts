import {
  type FrozenArrayType,
  type InterfaceType,
  type NullableType,
} from "@webidl";

import type { ReflectedIDLAttributeOf } from "./reflected-idl-attribute";
import type { ReflectedTargetAssociations as BaseReflectedTargetAssociations } from "./reflected-target";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ReflectedTargetAssociations<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  E extends Element,
> extends BaseReflectedTargetAssociations {}

export type ReflectedIDLAttribute<E extends Element> = ReflectedIDLAttributeOf<
  NullableType<FrozenArrayType<InterfaceType<E>>>
>;

export function getter<E extends Element>(
  this: ReflectedTargetAssociations<E>,
  reflectedIDLAttribute: ReflectedIDLAttribute<E>,
  reflectedContentAttributeName: string,
): readonly E[] | null {
  const elements = this.getAssociatedElements(
    reflectedIDLAttribute,
    reflectedContentAttributeName,
  );

  if (elements === null && this.cachedAssociatedElements === null) {
    return null;
  }

  if (
    elements !== null &&
    this.cachedAssociatedElements !== null &&
    elements.length === this.cachedAssociatedElements.length &&
    elements.every(
      (element, index) => element === this.cachedAssociatedElements?.[index],
    )
  ) {
    return this.cachedAssociatedElements;
  }

  const elementsAsFrozenArray = reflectedIDLAttribute.type(elements);

  this.cachedAssociatedElements = elementsAsFrozenArray;
  return elementsAsFrozenArray;
}

export function setter<E extends Element>(
  this: ReflectedTargetAssociations<E>,
  _: ReflectedIDLAttribute<E>,
  reflectedContentAttributeName: string,
  value: E[] | null,
): void {
  if (value === null) {
    this.explicitlySetElements = null;
    this.deleteContentAttribute(reflectedContentAttributeName);
    return;
  }

  this.setContentAttribute(reflectedContentAttributeName, "");

  const elements: WeakRef<E>[] = [];
  for (const attrElement of value) {
    elements.push(new WeakRef(attrElement));
  }

  this.explicitlySetElements = elements;
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

  this.explicitlySetElements = null;
}
