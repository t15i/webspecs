/** @see https://infra.spec.whatwg.org/#javascript-string-convert */
export function convertStringIntoScalarValueString(string: string): string {
  return string.toWellFormed();
}
