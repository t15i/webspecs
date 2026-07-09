/**
 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
 *
 * Splitting a string input on ASCII whitespace collects sequences of code
 * points that are not ASCII whitespace (TAB, LF, FF, CR, SPACE), so the
 * resulting list never contains empty strings.
 */
import { describe, expect, test } from "vitest";

import { splitOnASCIIWhitespace } from "lib/infra";

describe("splitOnASCIIWhitespace", () => {
  test.each([
    ["a b c", ["a", "b", "c"]],
    ["a  b", ["a", "b"]],
    ["  a b  ", ["a", "b"]],
    ["a\tb", ["a", "b"]],
    ["a\nb", ["a", "b"]],
    ["a\fb", ["a", "b"]],
    ["a\rb", ["a", "b"]],
    ["a \t\n\f\r b", ["a", "b"]],
    ["", []],
    ["   ", []],
    ["\t\n\f\r ", []],
    ["single", ["single"]],
  ] as const)("%j is split into %j", (input, expected) => {
    expect(splitOnASCIIWhitespace(input)).toEqual(expected);
  });

  test("does not split on non-ASCII whitespace (e.g. U+00A0)", () => {
    expect(splitOnASCIIWhitespace("a b")).toEqual(["a b"]);
  });
});
