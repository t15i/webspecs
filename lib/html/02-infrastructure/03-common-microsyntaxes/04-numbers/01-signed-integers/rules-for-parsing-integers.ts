/** @see https://html.spec.whatwg.org/#rules-for-parsing-integers */
export function integerParsing(value: string): number | "error" {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue)) {
    return "error";
  }

  return parsedValue;
}
