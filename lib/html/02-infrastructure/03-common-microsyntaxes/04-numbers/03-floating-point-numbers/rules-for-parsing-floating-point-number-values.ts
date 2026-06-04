/** @see https://html.spec.whatwg.org/#rules-for-parsing-floating-point-number-values */
export function floatingPointNumberParsing(value: string): number | "error" {
  const parsedValue = Number.parseFloat(value);

  if (!Number.isFinite(parsedValue)) {
    return "error";
  }

  return parsedValue;
}
