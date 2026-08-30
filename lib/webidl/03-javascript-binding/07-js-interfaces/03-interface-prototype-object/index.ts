import type { Interface } from "../../../02-idl";

/** @see https://webidl.spec.whatwg.org/#interface-prototype-object */
export interface InterfacePrototypeObject {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- see above
  constructor: Function;
}

class InterfacePrototypeObject_ {
  static #ifaces = new WeakMap<InterfacePrototypeObject, Interface>();

  static getInterfaceOf(proto: InterfacePrototypeObject): Interface | null {
    return this.#ifaces.get(proto) ?? null;
  }

  static setInterfaceOf<Proto extends InterfacePrototypeObject>(
    proto: Proto,
    iface: Interface,
  ): Proto {
    this.#ifaces.set(proto, iface);
    return proto;
  }
}

export type InterfacePrototypeObjectConstructor =
  typeof InterfacePrototypeObject_;

export const InterfacePrototypeObject: InterfacePrototypeObjectConstructor =
  InterfacePrototypeObject_;
