import { Element } from "@dom";
import type { DOMStringType, NullableType } from "@webidl";

import type { ReflectedTargetAssociations } from "./reflected-target";
import type { ReflectedIDLAttributeOf } from "./reflected-idl-attribute";

export type { ReflectedTargetAssociations };

export type ReflectedIDLAttribute = ReflectedIDLAttributeOf<
  NullableType<DOMStringType>
>;

export function getter(
  this: ReflectedTargetAssociations,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
): string | null {
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

    if (state?.canonicalKeyword === undefined) {
      return null;
    }

    return state.canonicalKeyword;
  }

  return contentAttributeValue;
}

export function setter(
  this: ReflectedTargetAssociations,
  _: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
  value: string | null,
): void {
  if (value === null) {
    this.deleteContentAttribute(reflectedContentAttributeName);
  } else {
    this.setContentAttribute(reflectedContentAttributeName, value);
  }
}
