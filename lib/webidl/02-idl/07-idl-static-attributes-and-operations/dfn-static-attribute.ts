import type { Attribute, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-static-attribute */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StaticAttribute<T extends Type = Type> extends Attribute<T> {}

/** @see https://webidl.spec.whatwg.org/#dfn-static-attribute */
export function isStaticAttribute(attribute: Attribute): boolean {
  return attribute.keywords.has("static");
}

/** @see https://webidl.spec.whatwg.org/#dfn-static-attribute */
export function validateStaticAttribute(attribute: Attribute): void {
  if (attribute.identifier === "prototype") {
    throw TypeError(`A static attribute must not be named "prototype".`);
  }
}
