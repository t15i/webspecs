import {
  asMemberList,
  validateArgumentList,
  type ArgumentList,
  type Interface,
  type Member,
  type Type,
} from "@webidl";

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConstructorOperationExtendedAttributes {}

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
export interface ConstructorOperation<Args extends Type[] = Type[]> {
  kind: "constructor";
  keywords: Set<string>;
  extendedAttributes: ConstructorOperationExtendedAttributes;
  arguments: ArgumentList<Args>;
  constructorSteps: new (
    ...args: {
      [K in keyof Args]: ReturnType<Args[K]>;
    }
  ) => object;
}

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
export function isConstructorOperation(
  member: Member,
): member is ConstructorOperation | ConstructorOperation[] {
  const first = Array.isArray(member) ? member[0] : member;
  return first?.kind === "constructor";
}

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
export function validateConstructorOperation(ctor: ConstructorOperation): void {
  validateArgumentList(ctor.arguments);
}

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
export function getOwnConstructorOperations(
  iface: Interface,
): ConstructorOperation[] {
  if (!Object.hasOwn(iface.members, "constructor")) {
    return [];
  }

  return asMemberList(
    iface.members["constructor"] as unknown as
      | ConstructorOperation
      | ConstructorOperation[],
  );
}
