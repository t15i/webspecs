import {
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
): member is ConstructorOperation {
  return member.kind === "constructor";
}

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
export function validateConstructorOperation(ctor: ConstructorOperation): void {
  validateArgumentList(ctor.arguments);
}

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
export function getOwnConstructorOperation(
  iface: Interface,
): ConstructorOperation | undefined {
  return Object.hasOwn(iface.members, "constructor")
    ? (iface.members["constructor"] as unknown as ConstructorOperation)
    : undefined;
}
