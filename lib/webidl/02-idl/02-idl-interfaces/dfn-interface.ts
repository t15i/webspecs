import {
  isAttribute,
  isIdentifier,
  isOperation,
  validateMember,
} from "@webidl";
import type { Member, Identifier } from "@webidl";

import { interfaceExtraValidationRules } from "./interface-extra-validation-rules";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InterfaceExtendedAttributes {}

export interface InterfaceStaticMembers {
  [key: Identifier]: Member;
}

export interface InterfaceMembers {
  // `constructor` is deliberately not declared as a named key: doing so collides
  // with the built-in `Object.prototype.constructor` (a `Function`), so every
  // object literal assigned to this type would fail to typecheck. An own
  // constructor operation is still stored under the `constructor` key at runtime
  // and resolved through `getOwnConstructorOperation`, which reads it by own-key.
  [key: Identifier]: Member;
}

/** @see https://webidl.spec.whatwg.org/#dfn-interface */
export interface Interface {
  inherit: Interface | null;
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

  for (const key of Reflect.ownKeys(iface.members)) {
    const member = Reflect.get(iface.members, key) as Member;

    if (isAttribute(member) || isOperation(member)) {
      validateMember(member);
    }
  }

  for (const key of Reflect.ownKeys(iface.staticMembers)) {
    const staticMember = Reflect.get(iface.staticMembers, key) as Member;

    if (!staticMember.keywords.has("static")) {
      throw TypeError(
        `A static member of an interface must be declared with the "static" keyword.`,
      );
    }
    validateMember(staticMember);
  }

  for (const rule of interfaceExtraValidationRules) {
    rule(iface);
  }
}
