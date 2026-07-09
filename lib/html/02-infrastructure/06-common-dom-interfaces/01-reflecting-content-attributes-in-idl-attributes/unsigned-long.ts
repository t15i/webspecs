import type { UnsignedLongType } from "@webidl";

import {
  nonNegativeIntegerParsing,
  shortestPossibleRepresentingAsValidNonNegativeInteger,
} from "@html";

import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTargetAssociations } from "./reflected-target";

export type { ReflectedTargetAssociations };

export type ReflectedIDLAttribute = BaseReflectedIDLAttribute<UnsignedLongType>;

export function getter(
  this: ReflectedTargetAssociations,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
): number {
  const contentAttributeValue = this.getContentAttribute(
    reflectedContentAttributeName,
  );

  let minimum = 0;

  if (
    reflectedIDLAttribute.limitedToOnlyPositiveNumbers === true ||
    reflectedIDLAttribute.limitedToOnlyPositiveNumbersWithFallback === true
  ) {
    minimum = 1;
  }

  if (reflectedIDLAttribute.clampedToRange !== undefined) {
    minimum = reflectedIDLAttribute.clampedToRange[0];
  }

  let maximum = 2147483647;

  if (reflectedIDLAttribute.clampedToRange !== undefined) {
    maximum = reflectedIDLAttribute.clampedToRange[1];
  }

  if (contentAttributeValue !== null) {
    const parsedValue = nonNegativeIntegerParsing(contentAttributeValue);

    if (
      parsedValue !== "error" &&
      parsedValue >= minimum &&
      parsedValue <= maximum
    ) {
      return parsedValue;
    }

    if (
      parsedValue !== "error" &&
      reflectedIDLAttribute.clampedToRange !== undefined
    ) {
      if (parsedValue < minimum) {
        return minimum;
      }

      return maximum;
    }
  }

  if (reflectedIDLAttribute.defaultValue !== undefined) {
    return reflectedIDLAttribute.defaultValue;
  }

  return minimum;
}

export function setter(
  this: ReflectedTargetAssociations,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
  value: number,
): void {
  if (
    reflectedIDLAttribute.limitedToOnlyPositiveNumbers === true &&
    value === 0
  ) {
    throw new DOMException(
      `The value provided is ${value}, which is an invalid index or size.`,
      "IndexSizeError",
    );
  }

  let minimum = 0;

  if (
    reflectedIDLAttribute.limitedToOnlyPositiveNumbers === true ||
    reflectedIDLAttribute.limitedToOnlyPositiveNumbersWithFallback === true
  ) {
    minimum = 1;
  }

  let newValue = minimum;

  if (reflectedIDLAttribute.defaultValue !== undefined) {
    newValue = reflectedIDLAttribute.defaultValue;
  }

  if (value >= minimum && value <= 2147483647) {
    newValue = value;
  }

  this.setContentAttribute(
    reflectedContentAttributeName,
    shortestPossibleRepresentingAsValidNonNegativeInteger(newValue),
  );
}
