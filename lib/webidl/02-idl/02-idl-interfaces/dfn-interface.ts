import {
  isIdentifier,
  iterateMemberSlots,
  iterateSpecialOperations,
  validateOperation,
  validateRegularMemberSlot,
  validateStaticMemberSlot,
} from "@webidl";
import type { MemberSlot, Identifier } from "@webidl";

import { interfaceExtraValidationRules } from "./interface-extra-validation-rules";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterfaceExtendedAttributes {}

export interface InterfaceStaticMembers {
  [key: Identifier]: MemberSlot;
}

export interface InterfaceMembers {
  // `constructor` is deliberately not declared as a named key: doing so collides
  // with the built-in `Object.prototype.constructor` (a `Function`), so every
  // object literal assigned to this type would fail to typecheck. An own
  // constructor operation is still stored under the `constructor` key at runtime
  // and resolved through `getOwnConstructorOperation`, which reads it by own-key.
  [key: Identifier]: MemberSlot;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterfaceBehaviors {}

/** @see https://webidl.spec.whatwg.org/#dfn-interface */
export interface Interface {
  inherit: Interface | null;
  extendedAttributes: InterfaceExtendedAttributes;
  identifier: Identifier;
  staticMembers: InterfaceStaticMembers;
  members: InterfaceMembers;
  behaviors: InterfaceBehaviors;
}

export { interfaceExtraValidationRules };

export function validateInterface(iface: Interface): void {
  if (!isIdentifier(iface.identifier)) {
    throw TypeError(
      `"${iface.identifier}" is not a valid Web IDL identifier for an interface.`,
    );
  }

  for (const [, slot] of iterateMemberSlots(iface.members)) {
    validateRegularMemberSlot(slot);
  }

  for (const [, slot] of iterateMemberSlots(iface.staticMembers)) {
    validateStaticMemberSlot(slot);
  }

  for (const operation of iterateSpecialOperations(iface)) {
    validateOperation(operation);
  }

  for (const rule of interfaceExtraValidationRules) {
    rule(iface);
  }
}
