import {
  bestRepresentationAsFloatingPointNumber,
  floatingPointNumberParsing,
} from "@html";

import type { ReflectedContentAttribute } from "./reflected-content-attribute";
import type { ReflectedIDLAttribute as BaseReflectedIDLAttribute } from "./reflected-idl-attribute";
import type { ReflectedTarget } from "./reflected-target";

export type { ReflectedTarget, ReflectedContentAttribute };

export interface ReflectedIDLAttribute extends BaseReflectedIDLAttribute {
  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers-greater-than-zero */
  readonly limitedToOnlyPositiveNumbers: boolean;

  /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#default-value */
  readonly defaultValue: number | null;
}

/**/
export function getter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
): number {
  const contentAttributeValue = this.getContentAttribute();

  if (contentAttributeValue !== null) {
    const parsedValue = floatingPointNumberParsing(contentAttributeValue);

    if (parsedValue !== "error" && parsedValue > 0) {
      return parsedValue;
    }

    if (
      parsedValue !== "error" &&
      !reflectedIDLAttribute.limitedToOnlyPositiveNumbers
    ) {
      return parsedValue;
    }
  }

  if (reflectedIDLAttribute.defaultValue !== null) {
    return reflectedIDLAttribute.defaultValue;
  }

  return 0;
}

/**/
export function setter(
  this: ReflectedTarget,
  reflectedIDLAttribute: ReflectedIDLAttribute,
  _: ReflectedContentAttribute,
  value: number,
): void {
  if (reflectedIDLAttribute.limitedToOnlyPositiveNumbers && value <= 0) {
    return;
  }

  this.setContentAttribute(bestRepresentationAsFloatingPointNumber(value));
}
