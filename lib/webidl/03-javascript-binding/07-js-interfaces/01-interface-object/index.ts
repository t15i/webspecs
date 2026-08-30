import type { Interface } from "../../../02-idl";

/** @see https://webidl.spec.whatwg.org/#interface-object */
export interface InterfaceObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): any;
}

class InterfaceObject_ {
  static #ifaces = new WeakMap<InterfaceObject, Interface>();

  static getInterfaceOf(obj: InterfaceObject): Interface | null {
    return this.#ifaces.get(obj) ?? null;
  }

  static setInterfaceOf<Obj extends InterfaceObject>(
    obj: Obj,
    iface: Interface,
  ): Obj {
    this.#ifaces.set(obj, iface);
    return obj;
  }
}

export type InterfaceObjectConstructor = typeof InterfaceObject_;

export const InterfaceObject: InterfaceObjectConstructor = InterfaceObject_;
