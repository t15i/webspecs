/**
 * @see https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#using-reflect-via-idl-extended-attributes
 *
 * Validation of the reflection extended attributes ([Reflect], [ReflectURL],
 * [ReflectDefault], [ReflectRange], …), registered against
 * `regularAttributeExtraValidationRules`.
 *
 * The IDL type constraints these extended attributes carry are intentionally
 * not re-checked here: each typed trigger/supplement instead requires the
 * corresponding reflection metadata to be set, and that metadata's own rule
 * (§ reflecting content attributes in IDL attributes) enforces the type. The
 * final `describe` block confirms that indirection end-to-end.
 */
import { describe, expect, test } from "vitest";

import {
  Reflect,
  ReflectDefault,
  ReflectNonNegative,
  ReflectPositive,
  ReflectPositiveWithFallback,
  ReflectRange,
  ReflectSetter,
  ReflectURL,
} from "lib/html";
import { validateAttribute, validateRegularAttribute } from "lib/webidl";

import {
  makeDOMStringType,
  makeLongType,
  makeUnsignedLongType,
  makeUSVStringType,
} from "../../../../webidl/02-idl/13-idl-types/utils";
import { makeReflectedRegularAttribute } from "../01-reflecting-content-attributes-in-idl-attributes/utils";

describe("reflection triggers - mutual exclusivity", () => {
  test("does not throw for a single trigger", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          extendedAttributes: { [Reflect]: null },
        }),
      ),
    ).not.toThrow();
  });

  test("throws for two triggers on the same attribute", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          extendedAttributes: { [Reflect]: null, [ReflectSetter]: null },
        }),
      ),
    ).toThrow(TypeError);
  });
});

describe("reflection triggers - content attribute name", () => {
  test("does not throw for a valid explicit content attribute name", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          extendedAttributes: { [Reflect]: "data-foo" },
        }),
      ),
    ).not.toThrow();
  });

  test("throws for an invalid explicit content attribute name", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          extendedAttributes: { [Reflect]: "1bad" },
        }),
      ),
    ).toThrow(TypeError);
  });

  test("does not validate a name when the argument is null", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          extendedAttributes: { [Reflect]: null },
        }),
      ),
    ).not.toThrow();
  });
});

describe("typed triggers require their reflection metadata", () => {
  test("[ReflectURL] without treatedAsURL throws", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUSVStringType(), {
          extendedAttributes: { [ReflectURL]: null },
        }),
      ),
    ).toThrow(TypeError);
  });

  test("[ReflectURL] with treatedAsURL on a USVString does not throw", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUSVStringType(), {
          extendedAttributes: { [ReflectURL]: null },
          treatedAsURL: true,
        }),
      ),
    ).not.toThrow();
  });

  test("[ReflectNonNegative] without limitedToOnlyNonNegativeNumbers throws", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          extendedAttributes: { [ReflectNonNegative]: null },
        }),
      ),
    ).toThrow(TypeError);
  });

  test("[ReflectNonNegative] with limitedToOnlyNonNegativeNumbers on a long does not throw", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          extendedAttributes: { [ReflectNonNegative]: null },
          limitedToOnlyNonNegativeNumbers: true,
        }),
      ),
    ).not.toThrow();
  });

  test("[ReflectPositive] without limitedToOnlyPositiveNumbers throws", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          extendedAttributes: { [ReflectPositive]: null },
        }),
      ),
    ).toThrow(TypeError);
  });

  test("[ReflectPositiveWithFallback] without limitedToOnlyPositiveNumbersWithFallback throws", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          extendedAttributes: { [ReflectPositiveWithFallback]: null },
        }),
      ),
    ).toThrow(TypeError);
  });
});

describe("[ReflectDefault]", () => {
  test("does not throw alongside [Reflect] with a default value on a long", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          extendedAttributes: { [Reflect]: null, [ReflectDefault]: 5 },
          defaultValue: 5,
        }),
      ),
    ).not.toThrow();
  });

  test("throws without an accompanying reflection trigger", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          extendedAttributes: { [ReflectDefault]: 5 },
          defaultValue: 5,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("throws alongside [ReflectSetter], which cannot carry a default value", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          extendedAttributes: { [ReflectSetter]: null, [ReflectDefault]: 5 },
          defaultValue: 5,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("throws when the default value metadata is not set", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          extendedAttributes: { [Reflect]: null, [ReflectDefault]: 5 },
        }),
      ),
    ).toThrow(TypeError);
  });
});

describe("[ReflectRange]", () => {
  test("does not throw alongside [Reflect] with a clamped range on an unsigned long", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          extendedAttributes: { [Reflect]: null, [ReflectRange]: [0, 10] },
          clampedToRange: [0, 10],
        }),
      ),
    ).not.toThrow();
  });

  test("throws without [Reflect]", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          extendedAttributes: { [ReflectRange]: [0, 10] },
          clampedToRange: [0, 10],
        }),
      ),
    ).toThrow(TypeError);
  });

  test("throws alongside a non-[Reflect] trigger", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          extendedAttributes: {
            [ReflectPositive]: null,
            [ReflectRange]: [0, 10],
          },
          limitedToOnlyPositiveNumbers: true,
          clampedToRange: [0, 10],
        }),
      ),
    ).toThrow(TypeError);
  });

  test("throws when the clamped range metadata is not set", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          extendedAttributes: { [Reflect]: null, [ReflectRange]: [0, 10] },
        }),
      ),
    ).toThrow(TypeError);
  });
});

describe("type constraints are enforced through the reflection metadata", () => {
  test("[ReflectURL] with treatedAsURL on a non-USVString throws", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          extendedAttributes: { [ReflectURL]: null },
          treatedAsURL: true,
        }),
      ),
    ).toThrow(TypeError);
  });

  test("[ReflectRange] with clampedToRange on a non-unsigned-long throws", () => {
    expect(() =>
      validateRegularAttribute(
        makeReflectedRegularAttribute(makeLongType(), {
          extendedAttributes: { [Reflect]: null, [ReflectRange]: [0, 10] },
          clampedToRange: [0, 10],
        }),
      ),
    ).toThrow(TypeError);
  });
});

describe("validateAttribute dispatches regular attributes through the reflection rules", () => {
  test("surfaces a reflection error for a regular attribute", () => {
    expect(() =>
      validateAttribute(
        makeReflectedRegularAttribute(makeUnsignedLongType(), {
          // [ReflectRange] without the required [Reflect] trigger.
          extendedAttributes: { [ReflectRange]: [0, 10] },
          clampedToRange: [0, 10],
        }),
      ),
    ).toThrow(TypeError);
  });

  test("does not throw for a valid regular reflected attribute", () => {
    expect(() =>
      validateAttribute(
        makeReflectedRegularAttribute(makeDOMStringType(), {
          extendedAttributes: { [Reflect]: null },
        }),
      ),
    ).not.toThrow();
  });
});
