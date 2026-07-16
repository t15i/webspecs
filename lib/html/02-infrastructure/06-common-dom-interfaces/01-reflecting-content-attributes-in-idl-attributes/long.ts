import { LONG_MAX, LONG_MIN, type LongType } from "@webidl";

import {
  integerParsing,
  nonNegativeIntegerParsing,
  shortestPossibleStringRepresentingAsValidInteger,
} from "@html";

import type { ReflectedTargetAssociations } from "./reflected-target";
import type { ReflectedIDLAttributeOf } from "./reflected-idl-attribute";

export type { ReflectedTargetAssociations };

export type ReflectedIDLAttribute = ReflectedIDLAttributeOf<LongType>;

export function getter(
  this: ReflectedTargetAssociations,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  reflectedContentAttributeName: string,
): number {
  const contentAttributeValue = this.getContentAttribute(
    reflectedContentAttributeName,
  );

  if (contentAttributeValue !== null) {
    const parsedValue =
      reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers === true
        ? nonNegativeIntegerParsing(contentAttributeValue)
        : integerParsing(contentAttributeValue);

    if (
      parsedValue !== "error" &&
      parsedValue >= LONG_MIN &&
      parsedValue <= LONG_MAX
    ) {
      return parsedValue;
    }
  }

  if (reflectedIDLAttribute.defaultValue !== undefined) {
    return reflectedIDLAttribute.defaultValue;
  }

  if (reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers === true) {
    return -1;
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
    reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers === true &&
    value < 0
  ) {
    throw new DOMException(
      `The value provided (${value}) is not positive or 0.`,
      "IndexSizeError",
    );
  }

  this.setContentAttribute(
    reflectedContentAttributeName,
    shortestPossibleStringRepresentingAsValidInteger(value),
  );
}
