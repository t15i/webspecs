import { EnumeratedAttributeStates } from "@html";

import type { ReflectedContentAttribute as BaseReflectedContentAttribute } from "./reflected-content-attribute";
import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTarget } from "./reflected-target";

export type { ReflectedTarget };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-known-values */
  readonly limitedToOnlyKnownValue: boolean;
}

export interface ReflectedContentAttribute extends BaseReflectedContentAttribute {
  states: EnumeratedAttributeStates | null;
}

export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttribute: ReflectedContentAttribute,
): string {
  // const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute();

  // > Let attributeDefinition be the attribute definition of *element*'s content attribute
  // > whose namespace is null and local name is the reflected content attribute name.
  const attributeDefinition = reflectedContentAttribute;

  if (
    // > ... attributeDefinition indicates it is an enumerated attribute ...
    attributeDefinition.states !== null &&
    reflectedIDLAttribute.limitedToOnlyKnownValue
  ) {
    const state = attributeDefinition.states.get(contentAttributeValue);

    if (state === null || state.keywords.size === 0) {
      return "";
    }

    return state.canonicalKeyword;
  }

  if (contentAttributeValue === null) {
    return "";
  }

  return contentAttributeValue;
}

export function setter(
  this: ReflectedTarget,
  _: ReflectedIDLAttribute,
  __: ReflectedContentAttribute,
  value: string,
): void {
  this.setContentAttribute(value);
}
