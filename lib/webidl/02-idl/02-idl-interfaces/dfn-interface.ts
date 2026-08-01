import { isIdentifier, validateMember } from "@webidl";
import type { Member, Identifier } from "@webidl";

import { interfaceExtraValidationRules } from "./interface-extra-validation-rules";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterfaceExtendedAttributes {}

export interface InterfaceStaticMembers {
  [key: Identifier]: Member;
}

export interface InterfaceMembers {
  [key: Identifier]: Member;
}

/** @see https://webidl.spec.whatwg.org/#dfn-interface */
export interface Interface {
  extendedAttributes: InterfaceExtendedAttributes;
  identifier: Identifier;
  staticMembers: InterfaceStaticMembers;
  members: InterfaceMembers;
}

export { interfaceExtraValidationRules };

export function validateInterface(iface: Interface): void {
  if (!isIdentifier(iface.identifier)) {
    throw TypeError(
      `"${iface.identifier}" is not a valid Web IDL identifier for an interface.`,
    );
  }

  for (const members of [iface.staticMembers, iface.members]) {
    for (const key of Reflect.ownKeys(members)) {
      validateMember(Reflect.get(members, key) as Member);
    }
  }

  for (const rule of interfaceExtraValidationRules) {
    rule(iface);
  }
}
