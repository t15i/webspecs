/** @see https://infra.spec.whatwg.org/#ascii-whitespace */
const ASCII_WHITESPACE = /[\t\n\f\r ]+/;

/** @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace */
export function splitOnASCIIWhitespace(input: string): string[] {
  const tokens: string[] = [];

  for (const token of input.split(ASCII_WHITESPACE)) {
    if (token !== "") {
      tokens.push(token);
    }
  }

  return tokens;
}
