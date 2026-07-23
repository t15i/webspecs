import {
  isUnsignedLongType,
  regularAttributeExtraValidationRules,
  type Type,
} from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#clamped-to-the-range */
    clampedToRange?: [number, number];
  }
}

regularAttributeExtraValidationRules.push((attr) => {
  if ("clampedToRange" in attr && !isUnsignedLongType(attr.type)) {
    throw TypeError(
      `A reflected IDL attribute clamped to the range must have the type "unsigned long".`,
    );
  }
});
