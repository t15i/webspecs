import type { ANY_TYPE_NAME, AnyType } from "./01-idl-any";
import type { UNDEFINED_TYPE_NAME, UndefinedType } from "./02-idl-undefined";
import type { BOOLEAN_TYPE_NAME, BooleanType } from "./03-idl-boolean";
import type { LONG_TYPE_NAME, LongType } from "./08-idl-long";
import type {
  UNSIGNED_LONG_TYPE_NAME,
  UnsignedLongType,
} from "./09-idl-unsigned-long";
import type { DOUBLE_TYPE_NAME, DoubleType } from "./14-idl-double";
import type { BIGINT_TYPE_NAME, BigIntType } from "./16-idl-bigint";
import type { DOM_STRING_TYPE_NAME, DOMStringType } from "./17-idl-DOMString";
import type {
  BYTE_STRING_TYPE_NAME,
  ByteStringType,
} from "./18-idl-ByteString";
import type { USV_STRING_TYPE_NAME, USVStringType } from "./19-idl-USVString";
import type { OBJECT_TYPE_NAME, ObjectType } from "./20-idl-object";
import type {
  INTERFACE_TYPE_NAME,
  InterfaceType,
} from "./22-idl-interface-type";
import type {
  CALLBACK_INTERFACE_TYPE_NAME,
  CallbackInterfaceType,
} from "./23-idl-callback-interface-type";
import type { DICTIONARY_TYPE_NAME, DictionaryType } from "./24-idl-dictionary";
import type {
  CALLBACK_FUNCTION_TYPE_NAME,
  CallbackFunctionType,
} from "./26-idl-callback-function-type";
import type { NULLABLE_TYPE_NAME, NullableType } from "./27-idl-nullable-type";
import type { SEQUENCE_TYPE_NAME, SequenceType } from "./28-idl-sequence-type";
import type {
  ASYNC_SEQUENCE_TYPE_NAME,
  AsyncSequenceType,
} from "./29-idl-async-sequence-type";
import type { RECORD_TYPE_NAME, RecordType } from "./30-idl-record-type";
import type { PROMISE_TYPE_NAME, PromiseType } from "./31-idl-promise-type";
import type { UNION_TYPE_NAME, UnionType } from "./32-idl-union";
import type { AnnotatedType } from "./33-idl-annotated-types";
import type {
  FROZEN_ARRAY_TYPE_NAME,
  FrozenArrayType,
} from "./35-idl-frozen-array-type";
import type {
  OBSERVABLE_ARRAY_TYPE_NAME,
  ObservableArrayType,
} from "./36-idl-observable-array-type";
import type { INTEGER_TYPE_NAME, IntegerType } from "./dfn-integer-type";
import type { NUMERIC_TYPE_NAME, NumericType } from "./dfn-numeric-type";
import type { STRING_TYPE_NAME, StringType } from "./dfn-string-type";

export * from "./01-idl-any";
export * from "./02-idl-undefined";
export * from "./03-idl-boolean";
export * from "./08-idl-long";
export * from "./09-idl-unsigned-long";
export * from "./14-idl-double";
export * from "./16-idl-bigint";
export * from "./17-idl-DOMString";
export * from "./18-idl-ByteString";
export * from "./19-idl-USVString";
export * from "./20-idl-object";
export * from "./22-idl-interface-type";
export * from "./23-idl-callback-interface-type";
export * from "./24-idl-dictionary";
export * from "./26-idl-callback-function-type";
export * from "./27-idl-nullable-type";
export * from "./28-idl-sequence-type";
export * from "./29-idl-async-sequence-type";
export * from "./30-idl-record-type";
export * from "./31-idl-promise-type";
export * from "./32-idl-union";
export * from "./33-idl-annotated-types";
export * from "./35-idl-frozen-array-type";
export * from "./36-idl-observable-array-type";
export * from "./dfn-integer-type";
export * from "./dfn-numeric-type";
export * from "./dfn-string-type";

export interface TypeBase<T = unknown> {
  (value: unknown): T;
}

/** @see https://webidl.spec.whatwg.org/#idl-any */
export type Type =
  | AnyType
  | UndefinedType
  | BooleanType
  | LongType
  | UnsignedLongType
  | DoubleType
  | BigIntType
  | DOMStringType
  | ByteStringType
  | USVStringType
  | ObjectType
  | InterfaceType
  | CallbackInterfaceType
  | DictionaryType
  | CallbackFunctionType
  | NullableType
  | SequenceType
  | AsyncSequenceType
  | RecordType
  | PromiseType
  | UnionType
  | AnnotatedType
  | FrozenArrayType
  | ObservableArrayType;

export type NativeType<T extends Type> = ReturnType<T>;

export interface TypeMap {
  [ANY_TYPE_NAME]: AnyType;
  [UNDEFINED_TYPE_NAME]: UndefinedType;
  [BOOLEAN_TYPE_NAME]: BooleanType;
  [LONG_TYPE_NAME]: LongType;
  [UNSIGNED_LONG_TYPE_NAME]: UnsignedLongType;
  [DOUBLE_TYPE_NAME]: DoubleType;
  [BIGINT_TYPE_NAME]: BigIntType;
  [DOM_STRING_TYPE_NAME]: DOMStringType;
  [BYTE_STRING_TYPE_NAME]: ByteStringType;
  [USV_STRING_TYPE_NAME]: USVStringType;
  [OBJECT_TYPE_NAME]: ObjectType;
  [INTERFACE_TYPE_NAME]: InterfaceType;
  [CALLBACK_INTERFACE_TYPE_NAME]: CallbackInterfaceType;
  [DICTIONARY_TYPE_NAME]: DictionaryType;
  [CALLBACK_FUNCTION_TYPE_NAME]: CallbackFunctionType;
  [NULLABLE_TYPE_NAME]: NullableType;
  [SEQUENCE_TYPE_NAME]: SequenceType;
  [ASYNC_SEQUENCE_TYPE_NAME]: AsyncSequenceType;
  [RECORD_TYPE_NAME]: RecordType;
  [PROMISE_TYPE_NAME]: PromiseType;
  [UNION_TYPE_NAME]: UnionType;
  [FROZEN_ARRAY_TYPE_NAME]: FrozenArrayType;
  [OBSERVABLE_ARRAY_TYPE_NAME]: ObservableArrayType;
  [INTEGER_TYPE_NAME]: IntegerType;
  [NUMERIC_TYPE_NAME]: NumericType;
  [STRING_TYPE_NAME]: StringType;
}
