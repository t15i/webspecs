import {
  Global,
  supportsIndexedProperties,
  supportsNamedProperties,
} from "@webidl";

import type { PlatformObject } from "./dfn-platform-object";

/** @see https://webidl.spec.whatwg.org/#dfn-legacy-platform-object */
export function isLegacyPlatformObject(o: PlatformObject): boolean {
  return (
    !(Global in o) &&
    (supportsIndexedProperties(o) || supportsNamedProperties(o))
  );
}
