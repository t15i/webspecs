import {
  isDoubleType,
  isLongType,
  isUnsignedLongType,
  regularAttributeExtraValidationRules,
  type Type,
} from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#default-value */
    defaultValue?: number;
  }
}

regularAttributeExtraValidationRules.push((attr) => {
  if (
    "defaultValue" in attr &&
    !(
      isLongType(attr.type) ||
      isUnsignedLongType(attr.type) ||
      isDoubleType(attr.type)
    )
  ) {
    throw TypeError(
      `A reflected IDL attribute with a default value must have the type "long", "unsigned long", or "double".`,
    );
  }
});
