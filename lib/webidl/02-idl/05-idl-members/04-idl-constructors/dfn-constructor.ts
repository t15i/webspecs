import {
  type ArgumentList,
  type Interface,
  type Member,
  type Type,
} from "@webidl";

/**
 * The single merge target for extended attributes applicable to constructor
 * operations.
 *
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConstructorOperationExtendedAttributes {}

/**
 * A constructor operation is invoked through `new` on the interface object. It
 * has neither an identifier nor a return type: its steps return the fully
 * formed platform object of the instance (its prototype and interface
 * association are the responsibility of the instance implementation, not of
 * these algorithms).
 *
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 */
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

/**
 * Resolves the constructor operation an interface was declared with, if any.
 * An interface "was declared with a constructor operation" exactly when one of
 * its members has kind `"constructor"`.
 *
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 */
export function getOwnConstructorOperation(
  iface: Interface,
): ConstructorOperation | undefined {
  return Object.hasOwn(iface.members, "constructor")
    ? (iface.members["constructor"] as unknown as ConstructorOperation)
    : undefined;
}
