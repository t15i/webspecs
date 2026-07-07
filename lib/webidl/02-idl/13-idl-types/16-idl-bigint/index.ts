import type { Type } from "@webidl";

export const BIGINT_TYPE_NAME = "bigint";

/** @see https://webidl.spec.whatwg.org/#idl-bigint */
export interface BigIntType extends Type<bigint> {
  name: typeof BIGINT_TYPE_NAME;
}

export function isBigIntType(T: Type): T is BigIntType {
  return T.name === BIGINT_TYPE_NAME;
}

declare module "@webidl" {
  interface TypeMap {
    [BIGINT_TYPE_NAME]: BigIntType;
  }
}
