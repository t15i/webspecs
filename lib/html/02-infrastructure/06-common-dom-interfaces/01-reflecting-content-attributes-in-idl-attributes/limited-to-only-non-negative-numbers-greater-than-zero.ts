import {
  isDoubleType,
  isUnsignedLongType,
  type RegularAttribute,
  type Type,
} from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers-greater-than-zero */
    limitedToOnlyPositiveNumbers?: boolean;
  }
}

/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers-greater-than-zero */
export function validateLimitedToOnlyPositiveNumbers(
  attr: RegularAttribute,
): void {
  if (
    "limitedToOnlyPositiveNumbers" in attr &&
    !(isUnsignedLongType(attr.type) || isDoubleType(attr.type))
  ) {
    throw TypeError(
      `A reflected IDL attribute limited to only non-negative numbers greater than zero must have the type "unsigned long" or "double".`,
    );
  }
}
