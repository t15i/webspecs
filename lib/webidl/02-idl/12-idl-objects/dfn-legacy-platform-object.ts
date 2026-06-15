import {
  type ImplementsInterfaceWith,
  type ImplementsInterfaceWithoutExtAttribute,
  Global,
  supportsIndexedProperties,
  supportsNamedProperties,
  IndexedPropertyGetter,
  NamedPropertyGetter,
} from "@webidl";

import type { PlatformObject } from "./dfn-platform-object";

export type LegacyPlatformObjectInterfaceBase =
  ImplementsInterfaceWithoutExtAttribute<PlatformObject, typeof Global>;

/** @see https://webidl.spec.whatwg.org/#dfn-legacy-platform-object */
export type LegacyPlatformObject =
  | ImplementsInterfaceWith<
      LegacyPlatformObjectInterfaceBase,
      typeof IndexedPropertyGetter
    >
  | ImplementsInterfaceWith<
      LegacyPlatformObjectInterfaceBase,
      typeof NamedPropertyGetter
    >;

export function isLegacyPlatformObject(
  o: PlatformObject,
): o is LegacyPlatformObject {
  return (
    !(Global in o) &&
    (supportsIndexedProperties(o) || supportsNamedProperties(o))
  );
}
