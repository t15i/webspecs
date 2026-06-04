import type { ReflectedContentAttribute } from "./reflected-content-attribute";
import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTarget as BaseReflectedTarget } from "./reflected-target";
import { firstElementInTreeOrderThatMeetsCriteria } from "./utils";

export interface ReflectedTarget<
  T extends Element,
> extends BaseReflectedTarget {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#explicitly-set-attr-element */
  explicitlySetElement: WeakRef<T> | null;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#attr-associated-element */
  getAssociatedElement(): T | null;
}

export interface ReflectedIDLAttribute<
  T extends Element,
> extends BaseReflectedIDLAttribute {
  T: new () => T;
}

export type { ReflectedContentAttribute };

export function getAssociatedElement<T extends Element>(
  this: ReflectedTarget<T>,
  reflectedIDLAttribute: ReflectedIDLAttribute<T>,
): Element | null {
  const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute();

  if (this.explicitlySetElement !== null) {
    const explicitlySetElement = this.explicitlySetElement.deref();

    if (explicitlySetElement?.getRootNode() === element.getRootNode()) {
      return explicitlySetElement;
    }

    return null;
  } else if (contentAttributeValue !== null) {
    const candidate = firstElementInTreeOrderThatMeetsCriteria({
      root: element.getRootNode(),
      id: contentAttributeValue,
      T: reflectedIDLAttribute.T,
    });

    if (candidate !== null) {
      return candidate;
    }

    return null;
  }

  return null;
}

export function getter<T extends Element>(this: ReflectedTarget<T>): T | null {
  return this.getAssociatedElement();
}

export function setter<T extends Element>(
  this: ReflectedTarget<T>,
  _: ReflectedIDLAttribute<T>,
  __: ReflectedContentAttribute,
  value: T | null,
): void {
  if (value === null) {
    this.explicitlySetElement = null;
    this.deleteContentAttribute();
    return;
  }

  this.setContentAttribute("");
  this.explicitlySetElement = new WeakRef(value);
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
  this.explicitlySetElement = null;
}
