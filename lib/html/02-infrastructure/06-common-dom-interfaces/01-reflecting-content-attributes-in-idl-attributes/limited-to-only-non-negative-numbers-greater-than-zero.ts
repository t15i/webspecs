import {
  isDoubleType,
  isUnsignedLongType,
  regularAttributeExtraValidationRules,
  type Type,
} from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers-greater-than-zero */
    limitedToOnlyPositiveNumbers?: boolean;
  }
}

regularAttributeExtraValidationRules.push((attr) => {
  if (
    "limitedToOnlyPositiveNumbers" in attr &&
    !(isUnsignedLongType(attr.type) || isDoubleType(attr.type))
  ) {
    throw TypeError(
      `A reflected IDL attribute limited to only non-negative numbers greater than zero must have the type "unsigned long" or "double".`,
    );
  }
});
