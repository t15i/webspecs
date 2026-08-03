import { isAttribute, type Attribute, type Member } from "@webidl";

export function collectAttributes(
  members: object,
  predicate?: (attribute: Attribute) => boolean,
): Attribute[] {
  const result: Attribute[] = [];
  for (const key of Reflect.ownKeys(members)) {
    const member = Reflect.get(members, key) as Member;
    if (isAttribute(member) && (predicate?.(member) ?? true)) {
      result.push(member);
    }
  }
  return result;
}
