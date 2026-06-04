import { type PropertyKey } from "@ecma";
import {
  type PlatformObject,
  PrimaryInterface,
  NamedPropertyGetter,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-a-named-property */
export function determineValueOfNamedProperty(
  o: PlatformObject,
  property: PropertyKey,
): unknown {
  return o[PrimaryInterface][NamedPropertyGetter]!.methodSteps(property);
}
