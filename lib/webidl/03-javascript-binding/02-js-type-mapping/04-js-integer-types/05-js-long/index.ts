import { convertToInt } from "@webidl";

export interface LongConstructor {
  (value: unknown): number;
  MIN: number;
  MAX: number;
}

/**
 * @see https://webidl.spec.whatwg.org/#js-long
 */
export const Long: LongConstructor = Object.freeze(
  Object.assign((value: unknown) => convertToInt(value, 32, "signed"), {
    MIN: -2147483648,
    MAX: 2147483647,
  }),
);
