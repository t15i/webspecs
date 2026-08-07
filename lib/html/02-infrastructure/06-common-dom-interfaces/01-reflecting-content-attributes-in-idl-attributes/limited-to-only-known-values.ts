import {
  isDOMStringType,
  isNullableType,
  type RegularAttribute,
  type Type,
} from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-known-values */
    limitedToOnlyKnownValues?: boolean;
  }
}

/** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-known-values */
export function validateLimitedToOnlyKnownValues(attr: RegularAttribute): void {
  if (
    "limitedToOnlyKnownValues" in attr &&
    !(
      isDOMStringType(attr.type) ||
      (isNullableType(attr.type) && isDOMStringType(attr.type.innerType))
    )
  ) {
    throw TypeError(
      `A reflected IDL attribute limited to only known values must have the type "DOMString" or "DOMString?".`,
    );
  }
}
