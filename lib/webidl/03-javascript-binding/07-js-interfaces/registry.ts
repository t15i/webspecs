import type { Interface } from "@webidl";

import { createInterfaceObject } from "./01-interface-object";

/**
 * The registry that maps an interface to its interface object and interface
 * prototype object. It serves two purposes:
 *
 * - **idempotency**: an interface has exactly one interface object and one
 *   interface prototype object, returned on every lookup; and
 * - **breaking the mutual dependency**: create an interface object records the
 *   interface object here *before* creating the prototype (whose step 14 reads
 *   it back), so the two algorithms do not recurse.
 */
interface RegistryEntry {
  interfaceObject?: CallableFunction;
  interfacePrototypeObject?: object;
}

const registry = new WeakMap<Interface, RegistryEntry>();

function getEntry(iface: Interface): RegistryEntry {
  let entry = registry.get(iface);
  if (entry === undefined) {
    entry = {};
    registry.set(iface, entry);
  }
  return entry;
}

/** Records the interface object of an interface. */
export function setInterfaceObject(
  iface: Interface,
  interfaceObject: CallableFunction,
): void {
  getEntry(iface).interfaceObject = interfaceObject;
}

/** Records the interface prototype object of an interface. */
export function setInterfacePrototypeObject(
  iface: Interface,
  interfacePrototypeObject: object,
): void {
  getEntry(iface).interfacePrototypeObject = interfacePrototypeObject;
}

/**
 * The interface object of an interface, created lazily on first request and
 * cached thereafter.
 *
 * @see https://webidl.spec.whatwg.org/#interface-object
 */
export function getInterfaceObject(iface: Interface): CallableFunction {
  const entry = getEntry(iface);
  if (entry.interfaceObject !== undefined) {
    return entry.interfaceObject;
  }
  return createInterfaceObject(iface);
}

/**
 * The interface prototype object of an interface. In this model the prototype
 * is always produced as part of creating the interface object (its step 14
 * needs the interface object), so a cache miss delegates there.
 *
 * @see https://webidl.spec.whatwg.org/#interface-prototype-object
 */
export function getInterfacePrototypeObject(iface: Interface): object {
  const entry = getEntry(iface);
  if (entry.interfacePrototypeObject === undefined) {
    getInterfaceObject(iface);
  }
  return entry.interfacePrototypeObject!;
}
