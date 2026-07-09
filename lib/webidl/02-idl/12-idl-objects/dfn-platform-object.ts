import type { PropertyKey } from "@ecma";
import type { Interface } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-platform-object */
export interface PlatformObject {
  [key: PropertyKey]: unknown;
}

class PlatformObjectConstructor {
  static #interfaces = new WeakMap<object, Interface>();

  /**
   * Returns the primary interface an object is associated with.
   *
   * A value typed as {@link PlatformObject} always has one; for an arbitrary
   * object it may return `null`. The base implementation always returns
   * `null` — implementations are expected to extend it.
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
