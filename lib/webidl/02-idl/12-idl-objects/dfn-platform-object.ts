import type { PropertyKey } from "@ecma";
import type { Interface } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-platform-object */
export interface PlatformObject {
  [key: PropertyKey]: unknown;
}

export interface PlatformObjectConstructor {
  /**
   * Returns the primary interface an object is associated with.
   *
   * A value typed as {@link PlatformObject} always has one; for an arbitrary
   * object it may return `null`. The base implementation always returns
   * `null` — implementations are expected to extend it.
   */
  getPrimaryInterfaceOf(o: PlatformObject): Interface;
  getPrimaryInterfaceOf(o: object): Interface | undefined;
}

function getPrimaryInterfaceOf(o: PlatformObject): Interface;
function getPrimaryInterfaceOf(o: object): Interface | undefined;
function getPrimaryInterfaceOf(): Interface | undefined {
  return;
}

export const PlatformObject: PlatformObjectConstructor = {
  getPrimaryInterfaceOf,
};
