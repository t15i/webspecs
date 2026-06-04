import { toNumber } from "@ecma";

export function toIntegerOrInfinity(argument: unknown): number {
  const number = toNumber(argument);

  if (Number.isNaN(number) || Object.is(number, +0) || Object.is(number, -0)) {
    return 0;
  }

  if (Object.is(number, +Infinity)) {
    return +Infinity;
  }

  if (Object.is(number, -Infinity)) {
    return -Infinity;
  }

  return Math.trunc(/*R*/ number);
}
