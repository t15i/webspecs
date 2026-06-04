import { modulo } from "@ecma";

/** @see https://tc39.es/ecma262/multipage/abstract-operations.html#sec-tofixedsizeinteger */
export function toFixedSizeInteger(
  int: number,
  signed: "unsigned" | "signed",
  bitWidth: number,
): number {
  if (int === +Infinity || int === -Infinity) {
    return 0;
  }

  let fixedInt = modulo(int, Math.pow(2, bitWidth));

  if (signed === "signed" && fixedInt >= Math.pow(2, bitWidth - 1)) {
    fixedInt = fixedInt - Math.pow(2, bitWidth);
  }

  return fixedInt;
}
