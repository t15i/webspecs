import { createBuiltinFunction } from "@ecma";
import {
  implementsInterface,
  isPromiseType,
  isRegularAttribute,
} from "@webidl";
import type { Attribute, Interface } from "@webidl";

/**
 * Creates the getter function for an attribute.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-attribute-getter
 */
export function createAttributeGetter(
  attribute: Attribute,
  // TODO (namespace): a namespace or interface
  iface: Interface,
): () => unknown {
  const steps = function (this: unknown): unknown {
    try {
      let idlObject: object | null = null;

      // TODO: (namespace): If target is an interface
      if (isRegularAttribute(attribute)) {
        const jsValue = this ?? globalThis;

        // TODO (security check): "If jsValue is a platform object,
        // then perform a security check..."

        if (!implementsInterface(this, iface)) {
          // TODO (LegacyLenientThis): "If attribute was specified with the
          // [LegacyLenientThis] extended attribute...",

          throw TypeError("Illegal invocation");
        }

        // TODO (ObservableArray): "If attribute’s type is an observable array
        // type..."

        idlObject = jsValue;
      }

      const R = Reflect.apply(attribute.getterSteps, idlObject, []);

      return attribute.type(R);
    } catch (error) {
      // Per spec the check is on the attribute's type directly ("if attribute's
      // type is a promise type"); a promise type is never nullable or annotated,
      // so no innermost-type unwrapping is needed.
      if (isPromiseType(attribute.type)) {
        return Promise.reject(error);
      }
      throw error;
    }
  };

  const name = "get " + attribute.identifier;

  const F = createBuiltinFunction(steps, 0, name, {
    construct: false,
  });

  return F;
}
