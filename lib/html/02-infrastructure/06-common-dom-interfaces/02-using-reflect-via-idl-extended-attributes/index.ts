import { validateAttributeLocalName } from "@dom";
import type { RegularAttribute } from "@webidl";

import { Reflect } from "./xattr-reflect";
import { ReflectNonNegative } from "./xattr-reflectnonnegative";
import { ReflectPositive } from "./xattr-reflectpositive";
import { ReflectPositiveWithFallback } from "./xattr-reflectpositivewithfallback";
import { ReflectSetter } from "./xattr-reflectsetter";
import { ReflectURL } from "./xattr-reflecturl";
import { ReflectDefault } from "./xattr-reflectdefault";
import { ReflectRange } from "./xattr-reflectrange";

export * from "./xattr-reflect";
export * from "./xattr-reflectdefault";
export * from "./xattr-reflectnonnegative";
export * from "./xattr-reflectpositive";
export * from "./xattr-reflectpositivewithfallback";
export * from "./xattr-reflectrange";
export * from "./xattr-reflectsetter";
export * from "./xattr-reflecturl";

/** @see https://html.spec.whatwg.org/#using-reflect-via-idl-extended-attributes */
export type ReflectionTrigger =
  | typeof Reflect
  | typeof ReflectNonNegative
  | typeof ReflectPositive
  | typeof ReflectPositiveWithFallback
  | typeof ReflectSetter
  | typeof ReflectURL;

/** @see https://html.spec.whatwg.org/#using-reflect-via-idl-extended-attributes */
export const reflectionTriggers: Set<ReflectionTrigger> = new Set([
  Reflect,
  ReflectNonNegative,
  ReflectPositive,
  ReflectPositiveWithFallback,
  ReflectSetter,
  ReflectURL,
]);

/** @see https://html.spec.whatwg.org/#using-reflect-via-idl-extended-attributes */
export type ReflectionSupplements = typeof ReflectDefault | typeof ReflectRange;

/** @see https://html.spec.whatwg.org/#using-reflect-via-idl-extended-attributes */
export const reflectionSupplements: Set<ReflectionSupplements> = new Set([
  ReflectDefault,
  ReflectRange,
]);

/** @see https://html.spec.whatwg.org/#using-reflect-via-idl-extended-attributes */
export function validateReflectionExtendedAttributes(
  attr: RegularAttribute,
): void {
  let hasTrigger = false;
  for (const trigger of reflectionTriggers) {
    if (!(trigger in attr.extendedAttributes)) continue;

    // Only one of the reflection triggers can be used at a time.
    if (hasTrigger) {
      throw TypeError(
        `At most one of [Reflect], [ReflectSetter], [ReflectURL], [ReflectNonNegative], [ReflectPositive], and [ReflectPositiveWithFallback] can be used on a single attribute.`,
      );
    }
    hasTrigger = true;

    // The reflected content attribute name, when given explicitly as the
    // extended attribute's argument, must be a valid attribute local name.
    const contentAttributeName = attr.extendedAttributes[trigger];
    if (typeof contentAttributeName === "string") {
      validateAttributeLocalName(contentAttributeName);
    }
  }

  // Each trigger that selects a typed reflection behavior must have set the
  // corresponding reflection metadata. The IDL type constraint that the
  // metadata implies is enforced by that metadata's own validation rule (see
  // the § "reflecting content attributes" concepts), so it is not repeated
  // here.
  if (ReflectURL in attr.extendedAttributes && !("treatedAsURL" in attr)) {
    throw TypeError(
      `[ReflectURL] requires the reflected IDL attribute to be treated as a URL.`,
    );
  }

  if (
    ReflectNonNegative in attr.extendedAttributes &&
    !("limitedToOnlyNonNegativeNumbers" in attr)
  ) {
    throw TypeError(
      `[ReflectNonNegative] requires the reflected IDL attribute to be limited to only non-negative numbers.`,
    );
  }

  if (
    ReflectPositive in attr.extendedAttributes &&
    !("limitedToOnlyPositiveNumbers" in attr)
  ) {
    throw TypeError(
      `[ReflectPositive] requires the reflected IDL attribute to be limited to only non-negative numbers greater than zero.`,
    );
  }

  if (
    ReflectPositiveWithFallback in attr.extendedAttributes &&
    !("limitedToOnlyPositiveNumbersWithFallback" in attr)
  ) {
    throw TypeError(
      `[ReflectPositiveWithFallback] requires the reflected IDL attribute to be limited to only non-negative numbers greater than zero, with fallback.`,
    );
  }

  if (ReflectDefault in attr.extendedAttributes) {
    // [ReflectDefault] must appear alongside one of the reflection triggers
    // that map to a plain value (i.e. not [ReflectSetter] or [ReflectURL]).
    if (
      !(
        Reflect in attr.extendedAttributes ||
        ReflectNonNegative in attr.extendedAttributes ||
        ReflectPositive in attr.extendedAttributes ||
        ReflectPositiveWithFallback in attr.extendedAttributes
      )
    ) {
      throw TypeError(
        `[ReflectDefault] must only appear alongside [Reflect], [ReflectNonNegative], [ReflectPositive], or [ReflectPositiveWithFallback].`,
      );
    }

    if (!("defaultValue" in attr)) {
      throw TypeError(
        `[ReflectDefault] requires the reflected IDL attribute to have a default value.`,
      );
    }
  }

  if (ReflectRange in attr.extendedAttributes) {
    // [ReflectRange] must appear alongside [Reflect].
    if (!(Reflect in attr.extendedAttributes)) {
      throw TypeError(`[ReflectRange] must only appear alongside [Reflect].`);
    }

    if (!("clampedToRange" in attr)) {
      throw TypeError(
        `[ReflectRange] requires the reflected IDL attribute to be clamped to the range.`,
      );
    }
  }
}
