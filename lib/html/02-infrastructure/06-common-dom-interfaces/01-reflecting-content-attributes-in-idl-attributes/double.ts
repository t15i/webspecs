import type { DoubleType } from "@webidl";

import {
  bestRepresentationAsFloatingPointNumber,
  floatingPointNumberParsing,
} from "@html";

import type { ReflectedTargetAssociations } from "./reflected-target";
import type { ReflectedIDLAttributeOf } from "./reflected-idl-attribute";

export type { ReflectedTargetAssociations };

export type ReflectedIDLAttribute = ReflectedIDLAttributeOf<DoubleType>;

export function getter(
  this: ReflectedTargetAssociations,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
): number {
  const contentAttributeValue = this.getContentAttribute(
    reflectedContentAttributeName,
  );

  if (contentAttributeValue !== null) {
    const parsedValue = floatingPointNumberParsing(contentAttributeValue);

    if (parsedValue !== "error" && parsedValue > 0) {
      return parsedValue;
    }

    if (
      parsedValue !== "error" &&
      reflectedIDLAttribute.limitedToOnlyPositiveNumbers !== true
    ) {
      return parsedValue;
    }
  }

  if (reflectedIDLAttribute.defaultValue !== undefined) {
    return reflectedIDLAttribute.defaultValue;
  }

  return 0;
}

export function setter(
  this: ReflectedTargetAssociations,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
  value: number,
): void {
  if (
    reflectedIDLAttribute.limitedToOnlyPositiveNumbers === true &&
    value <= 0
  ) {
    return;
  }

  this.setContentAttribute(
    reflectedContentAttributeName,
    bestRepresentationAsFloatingPointNumber(value),
  );
}
