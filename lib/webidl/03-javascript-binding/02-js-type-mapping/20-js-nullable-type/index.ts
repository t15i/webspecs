import { isObject } from "@ecma";
import {
  includesUndefined,
  isAnnotatedWithExtAttribute,
  isCallbackFunctionType,
  LegacyTreatNonObjectAsNull,
  type NativeType,
  type NullableType,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-nullable-type */
export function asNullable<T extends Type>(
  this: NullableType<T>,
  v: unknown,
): NativeType<T> | null {
  if (
    !isObject(v) &&
    isCallbackFunctionType(this.innerType) &&
    isAnnotatedWithExtAttribute(this.innerType, LegacyTreatNonObjectAsNull)
  ) {
    return null;
  }

  if (v === undefined && includesUndefined(this.innerType)) {
    return undefined as NativeType<T>;
  }

  if (v === null || v === undefined) {
    return null;
  }

  return this.innerType(v);
}
