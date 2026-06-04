import { convertToInt } from "@webidl";

export interface UnsignedLongConstructor {
  (value: unknown): number;
  MIN: number;
  MAX: number;
}

/**
 * @see https://webidl.spec.whatwg.org/#js-unsigned-long
 */
export const UnsignedLong: UnsignedLongConstructor = Object.freeze(
  Object.assign((value: unknown) => convertToInt(value, 32, "unsigned"), {
    MIN: 0,
    MAX: 4294967295,
  }),
);
