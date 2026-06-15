import { type PropertyName } from "@ecma";
import { type PlatformObject, PrimaryInterface } from "@webidl";
import { failure } from "@share";

export const ExistingNamedPropertyDeleter: unique symbol = Symbol.for(
  "@t15i/webspecs/webidl/ExistingNamedPropertyDeleter",
);

declare module "@webidl" {
  interface InterfaceMembers {
    [ExistingNamedPropertyDeleter]?(index: PropertyName): void | typeof failure;
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-delete-an-existing-named-property */
export function deleteExistingNamedProperty(
  o: PlatformObject,
  property: PropertyName,
): void | typeof failure {
  return o[PrimaryInterface].members[ExistingNamedPropertyDeleter]!.call(o, property);
}
