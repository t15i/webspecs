import type { Type } from "@webidl";

import { LONG_TYPE_NAME, type LongType } from "./08-idl-long";
import {
  UNSIGNED_LONG_TYPE_NAME,
  type UnsignedLongType,
} from "./09-idl-unsigned-long";

export const INTEGER_TYPE_NAME = "integer";

/** @see https://webidl.spec.whatwg.org/#dfn-integer-type */
export const INTEGER_TYPE_NAMES: Set<string> = new Set([
  // BYTE_TYPE_NAME,
  // OCTET_TYPE_NAME,
  // SHORT_TYPE_NAME,
  // UNSIGNED_SHORT_TYPE_NAME,
  LONG_TYPE_NAME,
  UNSIGNED_LONG_TYPE_NAME,
  // LONG_LONG_TYPE_NAME,
  // UNSIGNED_LONG_LONG_TYPE_NAME,
]);

export type IntegerType =
  // | ByteType
  // | OctetType
  // | ShortType
  // | UnsignedShortType
  LongType | UnsignedLongType;
// | LongLongType
// | UnsignedLongLongType

/** @see https://webidl.spec.whatwg.org/#dfn-integer-type */
export function isIntegerType(T: Type): T is IntegerType {
  return INTEGER_TYPE_NAMES.has(T.name);
}
