import {
  isByteStringType,
  isDOMStringType,
  isUSVStringType,
  type ByteStringType,
  type DOMStringType,
  type Type,
  type TypeBase,
  type USVStringType,
} from "@webidl";

export type RecordKeyType = DOMStringType | USVStringType | ByteStringType;

export const RECORD_TYPE_NAME = "Record";

/** @see https://webidl.spec.whatwg.org/#idl-record */
export interface RecordType<
  K extends RecordKeyType = RecordKeyType,
  V extends Type = Type,
> extends TypeBase<Record<ReturnType<K>, ReturnType<V>>> {
  name: typeof RECORD_TYPE_NAME;
  K: K;
  V: V;
}

/** @see https://webidl.spec.whatwg.org/#idl-record */
export function isRecordType(T: Type): T is RecordType {
  return T.name === RECORD_TYPE_NAME;
}

export function validateRecordKeyType(T: Type): T is RecordKeyType {
  if (!isDOMStringType(T) && !isUSVStringType(T) && !isByteStringType(T)) {
    throw TypeError("K must be one of DOMString, USVString, or ByteString.");
  }
  return true;
}
