import { definePropertyOrThrow, ordinaryObjectCreate } from "@ecma";
import {
  defineRegularAttributes,
  defineRegularOperations,
  defineTheIterationMethods,
  type Interface,
} from "@webidl";

import { getInterfaceObject, getInterfacePrototypeObject } from "../registry";

/**
 * Creates the interface prototype object of an interface.
 *
 * The `realm` parameter is omitted (single ambient realm), so intrinsics are
 * used as literals and the global prototype chain is always taken as mutable.
 *
 * @see https://webidl.spec.whatwg.org/#create-an-interface-prototype-object
 */
export function createInterfacePrototypeObject(iface: Interface): object {
  let proto: object;

  // TODO (Global): "If interface is declared with the [Global] extended
  // attribute..."

  if (iface.inherit !== null) {
    proto = getInterfacePrototypeObject(iface.inherit);
  } else if (iface.identifier === "DOMException") {
    proto = Error.prototype;
  } else {
    proto = Object.prototype;
  }

  // NOTE: "is global prototype chain mutable" is always true here, so the
  // ordinary object creation branch is always taken.
  const interfaceProtoObj = ordinaryObjectCreate(proto);

  // TODO (Unscopable): "If interface has any member declared with the
  // [Unscopable] extended attribute..."

  // TODO (Global): "If interface is not declared with the [Global] extended
  // attribute..."
  defineRegularAttributes(iface, interfaceProtoObj);
  defineRegularOperations(iface, interfaceProtoObj);
  defineTheIterationMethods(iface, interfaceProtoObj);
  // TODO (async iterable): "Define the asynchronous iteration methods..."

  // TODO (constants): "Define the constants of interface on
  // interfaceProtoObj given realm..."

  // TODO (LegacyNoInterfaceObject): "If the [LegacyNoInterfaceObject] extended
  // attribute..."
  const constructor = getInterfaceObject(iface);
  const desc = {
    value: constructor,
    writable: true,
    enumerable: false,
    configurable: true,
  };
  definePropertyOrThrow(interfaceProtoObj, "constructor", desc);

  return interfaceProtoObj;
}
