import {
  createBuiltinFunction,
  definePropertyOrThrow,
  ordinaryObjectCreate,
} from "@ecma";
import {
  createInterfacePrototypeObject,
  defineStaticAttributes,
  defineStaticOperations,
  defineUnforgeableRegularAttributes,
  defineUnforgeableRegularOperations,
  getConstructor,
  type Interface,
  type Member,
} from "@webidl";

import {
  getInterfaceObject,
  setInterfaceObject,
  setInterfacePrototypeObject,
} from "../registry";

/**
 * Emulates the `[[Unforgeables]]` internal slot of an interface object. It is
 * exported so callers (and tests) can read the slot by symbol identity rather
 * than by matching a description string.
 *
 * @see https://webidl.spec.whatwg.org/#interface-object
 */
export const Unforgeables: unique symbol = Symbol("[[Unforgeables]]");

/** @see https://webidl.spec.whatwg.org/#interface-object */
export interface InterfaceObject extends CallableFunction {
  [Unforgeables]: Record<string, Member>;
}

/**
 * Creates the interface object of an interface.
 *
 * The `realm` parameter is omitted (single ambient realm), so intrinsics are
 * used as literals. Overridden constructor steps are not modelled, so the
 * default constructor behaviour is always used.
 *
 * @see https://webidl.spec.whatwg.org/#create-an-interface-object
 */
export function createInterfaceObject(iface: Interface): InterfaceObject {
  const ctor = getConstructor(iface);

  const steps = function (this: unknown, ...args: unknown[]): unknown {
    if (ctor === undefined) {
      throw TypeError("Illegal constructor");
    }
    if (new.target === undefined) {
      throw TypeError(`Constructor "${iface.identifier}" requires 'new'.`);
    }

    // NOTE (no overloading): the JS runtime has a single signature per
    // operation, ignoring "Compute the effective overload set for constructors..."
    const constructor = ctor.constructorSteps;
    const values = ctor.arguments.map((argument, index) =>
      argument.type(args[index]),
    );

    const o = Reflect.construct(constructor, values, new.target);

    return o;
  };

  let constructorProto: object = Function.prototype;

  if (iface.inherit !== null) {
    constructorProto = getInterfaceObject(iface.inherit);
  }

  const unforgeables = ordinaryObjectCreate(null) as Record<string, Member>;

  defineUnforgeableRegularOperations(iface, unforgeables);
  defineUnforgeableRegularAttributes(iface, unforgeables);

  let length = 0;
  if (ctor !== undefined) {
    // NOTE (no overloading): ignoring "Compute the effective overload set..."
    length = ctor.arguments.length;
  }

  const F = createBuiltinFunction(steps, length, iface.identifier, {
    construct: true,
    proto: constructorProto,
  }) as unknown as InterfaceObject;
  setInterfaceObject(iface, F);

  F[Unforgeables] = unforgeables;

  const proto = createInterfacePrototypeObject(iface);
  setInterfacePrototypeObject(iface, proto);

  definePropertyOrThrow(F, "prototype", {
    value: proto,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // TODO (constants): "Define the constants of interface I on F given realm."
  defineStaticAttributes(iface, F);
  defineStaticOperations(iface, F);

  return F;
}
