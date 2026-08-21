import { validateMemberSlot, type MemberSlot } from "@webidl";

export * from "./dfn-static-attribute";
export * from "./dfn-static-operation";

/** @see https://webidl.spec.whatwg.org/#idl-static-attributes-and-operations */
export function validateStaticMemberSlot(slot: MemberSlot): void {
  for (const member of Array.isArray(slot) ? slot : [slot]) {
    if (!member.keywords.has("static")) {
      throw TypeError(
        `A static member of an interface must be declared with the "static" keyword.`,
      );
    }
  }

  validateMemberSlot(slot);
}
