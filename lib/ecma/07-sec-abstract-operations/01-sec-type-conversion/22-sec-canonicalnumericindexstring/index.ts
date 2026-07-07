import { toNumber } from "../04-sec-tonumber";

export function canonicalNumericIndexString(
  argument: string,
): number | undefined {
  if (argument === "-0") {
    return -0;
  }

  const n = toNumber(argument);

  if (String(n) === argument) {
    return n;
  }

  return undefined;
}
