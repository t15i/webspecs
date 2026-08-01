import { isObject } from "@ecma";
import {
  type NativeType,
  type RecordKeyType,
  type RecordType,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-record */
export function asRecord<RecordValueType extends Type>(
  this: RecordType<RecordKeyType, RecordValueType>,
  v: unknown,
): Record<string, NativeType<RecordValueType>> {
  if (!isObject(v)) {
    throw TypeError("The provided value cannot be converted to a record");
  }
  const result: Record<string, NativeType<RecordValueType>> = {};
  for (const key of Reflect.ownKeys(v)) {
    const desc = Reflect.getOwnPropertyDescriptor(v, key);
    if (desc !== undefined && desc.enumerable) {
      const typedKey = this.K(key);
      const value = Reflect.get(v, key);
      const typedValue = this.V(value);
      result[typedKey] = typedValue;
    }
  }
  return result;
}
