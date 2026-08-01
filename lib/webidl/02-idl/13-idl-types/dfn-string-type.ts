import { DOM_STRING_TYPE_NAME, type DOMStringType } from "./17-idl-DOMString";
import {
  BYTE_STRING_TYPE_NAME,
  type ByteStringType,
} from "./18-idl-ByteString";
import { USV_STRING_TYPE_NAME, type USVStringType } from "./19-idl-USVString";

export const STRING_TYPE_NAME = "string";

/** @see https://webidl.spec.whatwg.org/#dfn-string-type */
export const STRING_TYPE_NAMES: Set<string> = new Set([
  DOM_STRING_TYPE_NAME,
  USV_STRING_TYPE_NAME,
  BYTE_STRING_TYPE_NAME,
]);

/** @see https://webidl.spec.whatwg.org/#dfn-string-type */
export type StringType =
  // | EnumType
  DOMStringType | USVStringType | ByteStringType;
