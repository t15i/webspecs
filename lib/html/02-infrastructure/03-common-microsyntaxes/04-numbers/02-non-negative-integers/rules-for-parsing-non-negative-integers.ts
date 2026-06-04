import { integerParsing } from "@html";

/** https://html.spec.whatwg.org/#rules-for-parsing-non-negative-integers */
export function nonNegativeIntegerParsing(value: string): number | "error" {
  const parsedValue = integerParsing(value);

  if (parsedValue === "error") {
    return "error";
  }

  if (parsedValue < 0) {
    return "error";
  }

  return parsedValue;
}
