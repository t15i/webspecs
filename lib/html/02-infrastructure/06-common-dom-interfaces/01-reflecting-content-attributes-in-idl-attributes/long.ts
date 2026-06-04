import { Long } from "@webidl";

import {
  integerParsing,
  nonNegativeIntegerParsing,
  shortestPossibleStringRepresentingAsValidInteger,
} from "@html";

import type { ReflectedContentAttribute } from "./reflected-content-attribute";
import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTarget } from "./reflected-target";

export type { ReflectedTarget, ReflectedContentAttribute };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers */
  readonly limitedToOnlyNonNegativeNumbers: boolean;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#default-value */
  readonly defaultValue: number | null;
}

export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
): number {
  const contentAttributeValue = this.getContentAttribute();

  if (contentAttributeValue !== null) {
    const parsedValue = reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers
      ? nonNegativeIntegerParsing(contentAttributeValue)
      : integerParsing(contentAttributeValue);

    if (
      parsedValue !== "error" &&
      parsedValue >= Long.MIN &&
      parsedValue <= Long.MAX
    ) {
      return parsedValue;
    }
  }

  if (reflectedIDLAttribute.defaultValue !== null) {
    return reflectedIDLAttribute.defaultValue;
  }

  if (reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers) {
    return -1;
  }

  return 0;
}

export function setter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  _: ReflectedContentAttribute,
  value: number,
): void {
  if (reflectedIDLAttribute.limitedToOnlyNonNegativeNumbers && value < 0) {
    throw new DOMException(
      `The value provided (${value}) is not positive or 0.`,
      "IndexSizeError",
    );
  }

  this.setContentAttribute(
    shortestPossibleStringRepresentingAsValidInteger(value),
  );
}
