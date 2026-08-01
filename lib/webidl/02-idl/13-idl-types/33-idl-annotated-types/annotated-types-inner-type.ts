import { isAnnotatedType, type Type } from "@webidl";

declare module "@webidl" {
  interface AnnotatedType<T extends Type = Type> {
    /** @see https://webidl.spec.whatwg.org/#annotated-types-inner-type */
    innerType: T;
  }
}

export function validateAnnotatedInnerType(T: Type): void {
  if (isAnnotatedType(T)) {
    throw TypeError("The inner type of Annotated must not be Annotated");
  }
}
