import type { DoubleType, IntegerType } from "@webidl";

import { LONG_TYPE_NAME } from "./08-idl-long";
import { UNSIGNED_LONG_TYPE_NAME } from "./09-idl-unsigned-long";
import { DOUBLE_TYPE_NAME } from "./14-idl-double";

export const NUMERIC_TYPE_NAME = "numeric";

/** @see https://webidl.spec.whatwg.org/#dfn-numeric-type */
export const NUMERIC_TYPE_NAMES: Set<string> = new Set([
  LONG_TYPE_NAME,
  UNSIGNED_LONG_TYPE_NAME,
  DOUBLE_TYPE_NAME,
]);

/** @see https://webidl.spec.whatwg.org/#dfn-numeric-type */
export type NumericType =
  | IntegerType
  // | FloatType
  // | UnrestrictedFloatType
  | DoubleType;
// | UnrestrictedDoubleType;
