import type { Attribute } from "./dfn-attribute";

/** @see https://webidl.spec.whatwg.org/#dfn-read-only*/
export function isReadonlyAttribute(attribute: Attribute): boolean {
  return attribute.keywords.has("readonly");
}

/**
 * Validates the constraints specific to a read-only attribute: it must not
 * define setter steps. `validateAttribute` checks the complementary rule (a
 * read-write attribute must define them) before dispatching here.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-read-only
 */
export function validateReadonlyAttribute(attribute: Attribute): void {
  if (attribute.setterSteps !== undefined) {
    throw TypeError(`A read-only attribute must not define setter steps.`);
  }
}
