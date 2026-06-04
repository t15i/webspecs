import { type PropertyKey } from "@ecma";
import {
  type PlatformObject,
  PrimaryInterface,
  NamedPropertyDeleter,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-delete-an-existing-named-property */
export function deleteExistingNamedProperty(
  o: PlatformObject,
  property: PropertyKey,
): boolean {
  return o[PrimaryInterface][NamedPropertyDeleter]!.methodSteps(property);
}
