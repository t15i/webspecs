import { isLongType, type RegularAttribute, type Type } from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers */
    limitedToOnlyNonNegativeNumbers?: boolean;
  }
}

/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-non-negative-numbers */
export function validateLimitedToOnlyNonNegativeNumbers(
  attr: RegularAttribute,
): void {
  if ("limitedToOnlyNonNegativeNumbers" in attr && !isLongType(attr.type)) {
    throw TypeError(
      `A reflected IDL attribute limited to only non-negative numbers must have the type "long".`,
    );
  }
}
