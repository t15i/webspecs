import {
  isAttribute,
  iterateMemberSlots,
  type Attribute,
  type InterfaceMembers,
  type InterfaceStaticMembers,
} from "@webidl";

export function collectAttributes(
  members: InterfaceMembers | InterfaceStaticMembers,
  predicate?: (attribute: Attribute) => boolean,
): Attribute[] {
  const result: Attribute[] = [];

  for (const [, slot] of iterateMemberSlots(members)) {
    if (isAttribute(slot) && (predicate?.(slot) ?? true)) {
      result.push(slot);
    }
  }

  return result;
}
