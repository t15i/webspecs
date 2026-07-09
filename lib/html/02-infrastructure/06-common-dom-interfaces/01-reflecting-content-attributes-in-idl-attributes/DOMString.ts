import { Element } from "@dom";
import type { DOMStringType } from "@webidl";

import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTargetAssociations } from "./reflected-target";

export type ReflectedIDLAttribute = BaseReflectedIDLAttribute<DOMStringType>;

export type { ReflectedTargetAssociations };

export function getter(
  this: ReflectedTargetAssociations,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
): string {
  const element = this.getElement();
  const contentAttributeValue = this.getContentAttribute(
    reflectedContentAttributeName,
  );

  const attributeDefinition = Element.getContentAttributeDescriptor(
    element,
    reflectedContentAttributeName,
  );

  if (
    attributeDefinition?.states !== undefined &&
    reflectedIDLAttribute.limitedToOnlyKnownValues === true
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
  this: ReflectedTargetAssociations,
  _: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
  value: string,
): void {
  this.setContentAttribute(reflectedContentAttributeName, value);
}
