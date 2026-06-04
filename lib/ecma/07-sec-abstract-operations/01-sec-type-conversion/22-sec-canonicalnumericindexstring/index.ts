export function canonicalNumericIndexString(
  argument: string,
): number | undefined {
  if (argument === "-0") {
    return -0;
  }

  const n = Number(argument);

  if (String(n) === argument) {
    return n;
  }

  return undefined;
}
