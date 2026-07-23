import {
  isDOMStringType,
  isNullableType,
  regularAttributeExtraValidationRules,
  type Type,
} from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#limited-to-only-known-values */
    limitedToOnlyKnownValues?: boolean;
  }
}

regularAttributeExtraValidationRules.push((attr) => {
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
});
