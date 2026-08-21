/**
 * @see https://webidl.spec.whatwg.org/#idl-static-attributes-and-operations
 *
 * A static member is declared with the `static` keyword, and this model keeps
 * the static members of an interface in a table of their own — so a slot found
 * there must hold members that carry the keyword, every one of them when the
 * slot holds overloads. Beyond that a static slot is validated like any other.
 */
import { describe, expect, test } from "vitest";
import { validateStaticMemberSlot } from "lib/webidl";

import {
  makeAttribute,
  makeConstructor,
  makeOperation,
} from "../05-idl-members/utils";
import { makeDOMStringType, makeLongType } from "../13-idl-types/utils";

describe("validateStaticMemberSlot", () => {
  test("does not throw for a static attribute", () => {
    expect(() =>
      validateStaticMemberSlot(
        makeAttribute({
          type: makeDOMStringType(),
          identifier: "label",
          keywords: ["static"],
        }),
      ),
    ).not.toThrow();
  });

  test("does not throw for a slot of static overloads", () => {
    expect(() =>
      validateStaticMemberSlot([
        makeOperation({
          identifier: "make",
          keywords: ["static"],
          argumentTypes: [makeLongType()],
        }),
        makeOperation({ identifier: "make", keywords: ["static"] }),
      ]),
    ).not.toThrow();
  });

  test("throws for an attribute without the keyword", () => {
    expect(() =>
      validateStaticMemberSlot(
        makeAttribute({ type: makeDOMStringType(), identifier: "label" }),
      ),
    ).toThrow(/"static" keyword/);
  });

  test("throws when only some overloads carry the keyword", () => {
    expect(() =>
      validateStaticMemberSlot([
        makeOperation({ identifier: "make", keywords: ["static"] }),
        makeOperation({ identifier: "make" }),
      ]),
    ).toThrow(/"static" keyword/);
  });

  test("throws for a constructor operation, which is never static", () => {
    expect(() => validateStaticMemberSlot([makeConstructor({})])).toThrow(
      /"static" keyword/,
    );
  });

  test("propagates the errors of the slot itself", () => {
    // The keyword is there, so what is left is ordinary member validation.
    expect(() =>
      validateStaticMemberSlot([
        makeOperation({ identifier: "1bad", keywords: ["static"] }),
      ]),
    ).toThrow(/not a valid Web IDL identifier/);
  });
});
