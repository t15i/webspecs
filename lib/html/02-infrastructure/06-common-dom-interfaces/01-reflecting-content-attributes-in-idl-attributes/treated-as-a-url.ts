import {
  isUSVStringType,
  regularAttributeExtraValidationRules,
  type Type,
} from "@webidl";

declare module "@webidl" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface RegularAttribute<T extends Type = Type> {
    /** @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#treated-as-a-url */
    treatedAsURL?: boolean;
  }
}

regularAttributeExtraValidationRules.push((attr) => {
  if ("treatedAsURL" in attr && !isUSVStringType(attr.type)) {
    throw TypeError(
      `A reflected IDL attribute treated as a URL must have the type "USVString".`,
    );
  }
});
