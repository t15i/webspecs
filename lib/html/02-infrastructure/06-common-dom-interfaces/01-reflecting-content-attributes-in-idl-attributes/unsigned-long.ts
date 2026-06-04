import {
  nonNegativeIntegerParsing,
  shortestPossibleRepresentingAsValidNonNegativeInteger,
} from "@html";

import type { ReflectedContentAttribute } from "./reflected-content-attribute";
import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTarget } from "./reflected-target";

export type { ReflectedTarget, ReflectedContentAttribute };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers-greater-than-zero */
  readonly limitedToOnlyPositiveNumbers: boolean;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers-greater-than-zero-with-fallback */
  readonly limitedToOnlyPositiveNumbersWithFallback: boolean;
  readonly defaultValue: number | null;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#clamped-to-the-range */
  readonly clampedToRange: boolean;
  readonly clampedMin: number;
  readonly clampedMax: number;
}

export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
): number {
  const contentAttributeValue = this.getContentAttribute();

  let minimum = 0;

  if (
    reflectedIDLAttribute.limitedToOnlyPositiveNumbers ||
    reflectedIDLAttribute.limitedToOnlyPositiveNumbersWithFallback
  ) {
    minimum = 1;
  }

  if (reflectedIDLAttribute.clampedToRange) {
    minimum = reflectedIDLAttribute.clampedMin;
  }

  let maximum = 2147483647;

  if (reflectedIDLAttribute.clampedToRange) {
    maximum = reflectedIDLAttribute.clampedMax;
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

    if (parsedValue !== "error" && reflectedIDLAttribute.clampedToRange) {
      if (parsedValue < minimum) {
        return minimum;
      }

      return maximum;
    }
  }

  if (reflectedIDLAttribute.defaultValue !== null) {
    return reflectedIDLAttribute.defaultValue;
  }

  return minimum;
}

export function setter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  _: ReflectedContentAttribute,
  value: number,
): void {
  if (reflectedIDLAttribute.limitedToOnlyPositiveNumbers && value === 0) {
    throw new DOMException(
      `The value provided is ${value}, which is an invalid index or size.`,
      "IndexSizeError",
    );
  }

  let minimum = 0;

  if (
    reflectedIDLAttribute.limitedToOnlyPositiveNumbers ||
    reflectedIDLAttribute.limitedToOnlyPositiveNumbersWithFallback
  ) {
    minimum = 1;
  }

  let newValue = minimum;

  if (reflectedIDLAttribute.defaultValue !== null) {
    newValue = reflectedIDLAttribute.defaultValue;
  }

  if (value >= minimum && value <= 2147483647) {
    newValue = value;
  }

  this.setContentAttribute(
    shortestPossibleRepresentingAsValidNonNegativeInteger(newValue),
  );
}
