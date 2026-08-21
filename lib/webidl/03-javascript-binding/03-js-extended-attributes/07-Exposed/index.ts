import { asMemberList, isOperation } from "@webidl";
import type { Interface, Member } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#Exposed */
export const Exposed: unique symbol = Symbol("Exposed");

declare module "@webidl" {
  interface InterfaceExtendedAttributes {
    [Exposed]: string;
  }
  interface AttributeExtendedAttributes {
    [Exposed]?: string;
  }

  interface OperationExtendedAttributes {
    [Exposed]?: string;
  }
}

/** @see https://webidl.spec.whatwg.org/#Exposed */
export function validateExposedOverloads(a: Interface): void {
  for (const members of [a.members, a.staticMembers]) {
    for (const key of Reflect.ownKeys(members)) {
      const member = Reflect.get(members, key) as Member;

      if (!isOperation(member)) {
        continue;
      }

      const operations = asMemberList(member);
      const first = operations[0]!;

      for (const op of operations) {
        if (
          op.extendedAttributes[Exposed] !== first.extendedAttributes[Exposed]
        ) {
          throw TypeError(
            `If [Exposed] appears on an overloaded operation, then it must appear identically on all overloads, but "${String(key)}" declares it differently across its overloads.`,
          );
        }
      }
    }
  }
}
