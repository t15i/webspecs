import { definePropertyOrThrow } from "@ecma";
import { isUnforgeable, type Attribute, type Interface } from "@webidl";

import { createAttributeGetter } from "./attribute-getter";
import { createAttributeSetter } from "./attribute-setter";

/**
 * Defines a list of attributes on a target object as accessor properties.
 *
 * @see https://webidl.spec.whatwg.org/#define-the-attributes
 */
export function defineAttributes(
  attributes: Attribute[],
  // TODO (namespace): a namespace or interface
  iface: Interface,
  target: object,
): void {
  for (const attribute of attributes) {
    // NOTE (realm): "If attr is not exposed in realm..." is always false

    const getter = createAttributeGetter(attribute, iface);
    const setter = createAttributeSetter(attribute, iface);
    const configurable = !isUnforgeable(attribute);

    const desc: PropertyDescriptor = {
      get: getter,
      enumerable: true,
      configurable,
    };
    if (setter !== undefined) desc.set = setter;

    const id = attribute.identifier;

    definePropertyOrThrow(target, id, desc);

    // TODO (ObservableArray): "If attr's type is an observable array type ..."
  }
}
