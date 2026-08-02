import { supportsIndexedProperties, supportsNamedProperties } from "@webidl";

import type { PlatformObject } from "./dfn-platform-object";

/** @see https://webidl.spec.whatwg.org/#dfn-legacy-platform-object */
export function isLegacyPlatformObject(o: PlatformObject): boolean {
  return (
    // TODO (Global): implement an interface which does not have a [Global] extended attribute and which
    supportsIndexedProperties(o) || supportsNamedProperties(o)
  );
}
