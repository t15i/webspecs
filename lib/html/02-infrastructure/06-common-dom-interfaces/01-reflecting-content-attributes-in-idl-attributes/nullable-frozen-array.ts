import {
  type FrozenArrayType,
  type InterfaceType,
  type NullableType,
} from "@webidl";

import type { ReflectedContentAttribute } from "./reflected-content-attribute";
import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTarget as BaseReflectedTarget } from "./reflected-target";
import { firstElementInTreeOrderThatMeetsCriteria } from "./utils";

export interface ReflectedTarget<
  T extends Element,
> extends BaseReflectedTarget {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#explicitly-set-attr-elements */
  explicitlySetElements: WeakRef<T>[] | null;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#cached-attr-associated-elements-object */
  cachedAssociatedElements: readonly T[] | null;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#attr-associated-elements */
  getAssociatedElements(): T[] | null;
}

export interface ReflectedIDLAttribute<
  T extends Element,
> extends BaseReflectedIDLAttribute {
  readonly T: NullableType<FrozenArrayType<InterfaceType<T>>>;
}

export type { ReflectedContentAttribute };

export function getAssociatedElements<T extends Element>(
  this: ReflectedTarget<T>,
  reflectedIDLAttribute: ReflectedIDLAttribute<T>,
): T[] | null {
  const elements: T[] = [];
  const element = this.getElement();

  if (this.explicitlySetElements !== null) {
    for (const attrElementRef of this.explicitlySetElements) {
      const attrElement = attrElementRef.deref();

      if (attrElement?.getRootNode() === element.getRootNode()) {
        elements.push(attrElement);
      }
    }
  } else {
    const contentAttributeValue = this.getContentAttribute();

    if (contentAttributeValue === null) {
      return null;
    }

    const tokens = contentAttributeValue.split(" ");

    for (const id of tokens) {
      const candidate = firstElementInTreeOrderThatMeetsCriteria({
        root: element.getRootNode(),
        id,
        T: reflectedIDLAttribute.T.innerType.T.T,
      });

      if (candidate === null) {
        continue;
      }

      elements.push(candidate);
    }
  }

  return elements;
}

export function getter<T extends Element>(
  this: ReflectedTarget<T>,
  reflectedIDLAttribute: ReflectedIDLAttribute<T>,
): readonly T[] | null {
  const elements = this.getAssociatedElements();

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

  const elementsAsFrozenArray = reflectedIDLAttribute.T(elements);

  this.cachedAssociatedElements = elementsAsFrozenArray;
  return elementsAsFrozenArray;
}

export function setter<T extends Element>(
  this: ReflectedTarget<T>,
  _: ReflectedIDLAttribute<T>,
  __: ReflectedContentAttribute,
  value: T[] | null,
): void {
  if (value === null) {
    this.explicitlySetElements = null;
    this.deleteContentAttribute();
    return;
  }

  this.setContentAttribute("");

  const elements = [];
  for (const element of value) {
    elements.push(new WeakRef(element));
  }

  this.explicitlySetElements = elements;
}

export function attributeChanged<T extends Element>(
  this: ReflectedTarget<T>,
  _: ReflectedIDLAttribute<T>,
  reflectedContentAttribute: ReflectedContentAttribute,
  __: T,
  localName: string,
  ___: string | null,
  ____: string | null,
  namespace: string | null,
): void {
  if (localName !== reflectedContentAttribute.name || namespace !== null) {
    return;
  }
  this.explicitlySetElements = null;
}
