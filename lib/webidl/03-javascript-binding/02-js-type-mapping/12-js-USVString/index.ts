import { convertStringIntoScalarValueString } from "@infra";
import {
  isAnnotatedWithExtAttribute,
  LegacyNullToEmptyString,
  type USVStringType,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#js-USVString */
export function asUSVString(this: USVStringType, v: unknown): string {
  if (
    v === null &&
    isAnnotatedWithExtAttribute(this, LegacyNullToEmptyString)
  ) {
    return "";
  }
  return convertStringIntoScalarValueString(`${v}`);
}
