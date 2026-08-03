import type {
  ArgumentList,
  Interface,
  Member,
  PlatformObject,
  Type,
} from "@webidl";

/**
 * The single merge target for extended attributes applicable to constructor
 * operations.
 *
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConstructorExtendedAttributes {}

/**
 * A constructor operation is invoked through `new` on the interface object. It
 * has neither an identifier nor a return type: its steps return the fully
 * formed platform object of the instance (its prototype and interface
 * association are the responsibility of the instance implementation, not of
 * these algorithms).
 *
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 */
export interface Constructor<Args extends Type[] = Type[]> {
  kind: "constructor";
  keywords: Set<string>;
  extendedAttributes: ConstructorExtendedAttributes;
  arguments: ArgumentList<Args>;
  constructorSteps(
    ...args: {
      [K in keyof Args]: ReturnType<Args[K]>;
    }
  ): PlatformObject;
}

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
export function isConstructor(member: Member): member is Constructor {
  return member.kind === "constructor";
}

/**
 * Resolves the constructor operation an interface was declared with, if any.
 * An interface "was declared with a constructor operation" exactly when one of
 * its members has kind `"constructor"`.
 *
 * @see https://webidl.spec.whatwg.org/#idl-constructors
 */
export function getConstructor(iface: Interface): Constructor | undefined {
  // A plain `iface.members["constructor"]` would resolve up the prototype chain
  // to `Object.prototype.constructor` when no own key exists, so the own-key
  // check is essential to distinguish "no constructor" from that inherited value.
  // `members["constructor"]` resolves to the built-in `Object.prototype.constructor`
  // type, so the value is routed through `unknown` to the declared member type.
  return Object.hasOwn(iface.members, "constructor")
    ? (iface.members["constructor"] as unknown as Constructor)
    : undefined;
}

/** @see https://webidl.spec.whatwg.org/#idl-constructors */
export function validateConstructor(constructor: Constructor): void {
  // A constructor operation carries neither an identifier nor a return type, so
  // its shape is fully constrained by the Constructor interface; there are no
  // further runtime invariants to check.
  void constructor;
}
