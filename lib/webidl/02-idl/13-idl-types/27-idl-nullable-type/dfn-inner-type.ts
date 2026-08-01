import {
  DICTIONARY_TYPE_NAME,
  includesNullableType,
  isAnyType,
  isNullableType,
  isObservableArrayType,
  isPromiseType,
  isUnionType,
  type Type,
} from "@webidl";

declare module "@webidl" {
  interface NullableType<T extends Type = Type> {
    /** @see https://webidl.spec.whatwg.org/#dfn-inner-type */
    innerType: T;
  }
}

export function validateNullableInnerType(T: Type): void {
  if (
    isAnyType(T) ||
    isPromiseType(T) ||
    isObservableArrayType(T) ||
    isNullableType(T) ||
    (isUnionType(T) &&
      (includesNullableType(T) ||
        T.flattenedMemberTypes.has(DICTIONARY_TYPE_NAME)))
  ) {
    throw TypeError(
      "The inner type of Union must not be: any, a promise type, an observable array type, another nullable type, or a union type that itself includes a nullable type or has a dictionary type as one of its flattened member types.",
    );
  }
}
