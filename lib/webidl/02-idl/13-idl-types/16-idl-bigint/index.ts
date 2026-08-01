import type { Type, TypeBase } from "@webidl";

export const BIGINT_TYPE_NAME = "bigint";

/** @see https://webidl.spec.whatwg.org/#idl-bigint */
export interface BigIntType extends TypeBase<bigint> {
  name: typeof BIGINT_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#idl-bigint */
export function isBigIntType(T: Type): T is BigIntType {
  return T.name === BIGINT_TYPE_NAME;
}
