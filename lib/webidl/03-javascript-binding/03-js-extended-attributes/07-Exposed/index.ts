import { isOperation, iterateMemberSlots } from "@webidl";
import type { Interface } from "@webidl";

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
    for (const [identifier, slot] of iterateMemberSlots(members)) {
      if (!isOperation(slot)) {
        continue;
      }

      const first = slot[0]!;

      for (const op of slot) {
        if (
          op.extendedAttributes[Exposed] !== first.extendedAttributes[Exposed]
        ) {
          throw TypeError(
            `If [Exposed] appears on an overloaded operation, then it must appear identically on all overloads, but "${identifier}" declares it differently across its overloads.`,
          );
        }
      }
    }
  }
}
