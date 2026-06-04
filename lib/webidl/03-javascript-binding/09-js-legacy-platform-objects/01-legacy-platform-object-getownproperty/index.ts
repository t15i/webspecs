import type { PropertyName } from "@ecma";
import {
  type PlatformObject,
  legacyPlatformObjectGetOwnProperty,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#legacy-platform-object-getownproperty */
export function getOwnProperty(
  o: PlatformObject,
  p: PropertyName,
): PropertyDescriptor | undefined {
  return legacyPlatformObjectGetOwnProperty(o, p, false);
}
