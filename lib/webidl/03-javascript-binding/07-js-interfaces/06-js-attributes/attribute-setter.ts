import { createBuiltinFunction } from "@ecma";
import {
  implementsInterface,
  isReadonlyAttribute,
  isRegularAttribute,
  type Attribute,
  type Interface,
} from "@webidl";

/**
 * Creates the setter function for an attribute, or returns `undefined` when the
 * attribute has no setter.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-attribute-setter
 */
export function createAttributeSetter(
  attribute: Attribute,
  // TODO (namespace): a namespace or interface
  iface: Interface,
): ((value: unknown) => void) | undefined {
  // TODO (namespace): "If target is a namespace..."

  // TODO (LegacyLenientSetter): "does not have a [LegacyLenientSetter] or..."
  // TODO (PutForwards): "does not have a [PutForwards] or..."
  // TODO (Replaceable): "does not have a [Replaceable]..."
  if (isReadonlyAttribute(attribute) || attribute.setterSteps === undefined) {
    return undefined;
  }

  const steps = function (this: unknown, ...args: unknown[]): void {
    // "... undefined or the value of the first argument passed ..."
    const V = args[0];

    let idlObject: object | null = null;

    if (isRegularAttribute(attribute)) {
      const jsValue = this ?? globalThis;

      // TODO (security check): "If jsValue is a platform object,
      // then perform a security check..."

      const validThis = implementsInterface(this, iface);

      if (
        validThis === false
        // TODO (LegacyLenientThis): "... and attribute was not specified with the
        // [LegacyLenientThis] extended attribute..."
      ) {
        throw TypeError("Illegal invocation");
      }

      // TODO (Replaceable): "If attribute is declared with the [Replaceable]
      // extended attribute..."

      // TODO (LegacyLenientThis): "If validThis is false, then return undefined."

      // TODO (LegacyLenientSetter): "If attribute is declared with a
      // [LegacyLenientSetter] extended attribute..."

      // TODO (PutForwards): "If attribute is declared with a [PutForwards]
      // extended attribute, then..."

      idlObject = jsValue;

      // TODO (ObservableArray): "If attribute’s type is an observable array type..."
    }

    // TODO (enumeration): "If attribute’s type is an enumeration..."
    const idlValue = attribute.type(V);

    Reflect.apply(attribute.setterSteps!, idlObject, [idlValue]);

    return undefined;
  };

  const name = "set " + attribute.identifier;

  const F = createBuiltinFunction(steps, 1, name, {
    construct: false,
  });

  return F;
}
