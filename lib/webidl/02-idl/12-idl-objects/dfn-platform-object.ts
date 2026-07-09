import type { PropertyKey } from "@ecma";
import type { Interface } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-platform-object */
export interface PlatformObject {
  [key: PropertyKey]: unknown;
}

class PlatformObjectConstructor {
  static #interfaces = new WeakMap<object, Interface>();

  /**
   * Resolves the primary interface an object is associated with.
   *
   * @param o - the object for which the primary interface to be resolved
   *
   * @returns The primary interface associated with the object if any,
   * `undefined` otherwise. A value typed as {@link PlatformObject} is always
   * associated with one, so the corresponding overload narrows the result to
   * {@link Interface}.
   */
  static getPrimaryInterfaceOf(o: PlatformObject): Interface;
  static getPrimaryInterfaceOf(o: object): Interface | undefined;
  static getPrimaryInterfaceOf(o: object): Interface | undefined {
    let key: object | null = o;

    while (key !== null) {
      const iface = this.#interfaces.get(key);

      if (iface !== undefined) {
        return iface;
      }

      key = Object.getPrototypeOf(key) as object | null;
    }

    return undefined;
  }

  /**
   * Associates an object with its primary interface.
   *
   * @param o - the object to be associated with the interface
   * @param iface - the primary interface to be associated with the object
   *
   * @returns The object passed to the function
   */
  static setPrimaryInterfaceOf<T extends object>(o: T, iface: Interface): T {
    this.#interfaces.set(o, iface);
    return o;
  }

  constructor() {
    throw TypeError("Illegan constructor");
  }
}

export const PlatformObject: typeof PlatformObjectConstructor =
  PlatformObjectConstructor;

export type { PlatformObjectConstructor };
