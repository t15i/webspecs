/**
 * Test factories for the attribute reflection layer.
 *
 * `makeElementReflectedTarget` builds a `ReflectedTargetAssociations`
 * implementation for an element reflected target, wired to the canonical
 * element-flavored helpers shipped by the library.
 *
 * `makeReflectedIDLAttribute` manufactures a partial reflected IDL attribute
 * carrying only the reflection metadata a test cares about; the remaining
 * `Attribute` members are irrelevant to the getters and setters under test.
 */
import {
  deleteContentAttributeOfElementReflectedTarget,
  getContentAttributeOfElementReflectedTarget,
  getElementOfElementReflectedTarget,
  setContentAttributeOfElementReflectedTarget,
  type ReflectedTargetAssociations,
} from "lib/html";
import type { RegularAttribute, Type } from "lib/webidl";

import { makeAttribute } from "../../../../../webidl/02-idl/05-idl-members/utils";

export function makeElementReflectedTarget(
  element: HTMLElement,
): ReflectedTargetAssociations {
  return {
    getElement: () => getElementOfElementReflectedTarget(element),
    getContentAttribute: (name) =>
      getContentAttributeOfElementReflectedTarget(element, name),
    setContentAttribute: (name, value) =>
      setContentAttributeOfElementReflectedTarget(element, name, value),
    deleteContentAttribute: (name) =>
      deleteContentAttributeOfElementReflectedTarget(element, name),
  };
}

export function makeReflectedIDLAttribute<A>(properties: object = {}): A {
  return properties as unknown as A;
}

/**
 * Builds a regular (non-static) attribute with a fixed `type`, carrying any
 * reflection metadata (`treatedAsURL`, `defaultValue`, `clampedToRange`, the
 * `limitedTo…` flags, …) and/or reflection `extendedAttributes` a validation
 * test wants to exercise. Used to drive `validateRegularAttribute` and the
 * reflection rules registered against `regularAttributeExtraValidationRules`.
 */
export function makeReflectedRegularAttribute<T extends Type>(
  type: T,
  overrides: Partial<Omit<RegularAttribute<T>, "type">> = {},
): RegularAttribute<T> {
  return { ...makeAttribute({ type }), ...overrides } as RegularAttribute<T>;
}
