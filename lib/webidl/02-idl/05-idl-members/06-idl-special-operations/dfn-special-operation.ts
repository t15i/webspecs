import {
  isStaticOperation,
  isUnsignedLongType,
  validateIndexedPropertyGetter,
  validateIndexedPropertySetter,
  validateNamedPropertyDeleter,
  validateNamedPropertyGetter,
  validateNamedPropertySetter,
  type Operation,
  type Type,
} from "@webidl";

/** https://webidl.spec.whatwg.org/#dfn-special-operation */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SpecialOperation<
  Args extends Type[] = Type[],
  Return extends Type = Type,
> extends Operation<Args, Return> {}

/** https://webidl.spec.whatwg.org/#dfn-special-operation */
export function isSpecialOperation(op: Operation): boolean {
  return (
    op.keywords.has("getter") ||
    op.keywords.has("setter") ||
    op.keywords.has("deleter")
  );
}

/**
 * Validates the invariants shared by every special operation, then dispatches
 * to the validator for the specific variety it declares. Every variety takes at
 * least one argument, so an operation declared as special with none matches no
 * declaration. Whether a getter or setter is indexed or named is decided by its
 * first argument: an "unsigned long" index makes it indexed, anything else makes
 * it named (and the named validator rejects a first argument that is not a
 * "DOMString"). A deleter has only the named variety.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-special-operation
 */
export function validateSpecialOperation(op: Operation): void {
  if (isStaticOperation(op)) {
    throw TypeError(`A special operation must not be static.`);
  }

  const specialKeywordsNumber =
    Number(op.keywords.has("getter")) +
    Number(op.keywords.has("setter")) +
    Number(op.keywords.has("deleter"));

  if (specialKeywordsNumber === 0) {
    throw TypeError(
      `A special operation must be declared as a getter, setter, or deleter.`,
    );
  }

  if (specialKeywordsNumber > 1) {
    throw TypeError(
      `A special operation must not combine getter, setter, and deleter keywords.`,
    );
  }

  if (op.arguments.length === 0) {
    throw TypeError(
      `This operation is declared as a special operation but, taking no arguments, matches no getter, setter, or deleter declaration.`,
    );
  }

  const isIndexed = isUnsignedLongType(op.arguments[0]!.type);

  if (op.keywords.has("getter")) {
    if (isIndexed) {
      validateIndexedPropertyGetter(op);
    } else {
      validateNamedPropertyGetter(op);
    }
  } else if (op.keywords.has("setter")) {
    if (isIndexed) {
      validateIndexedPropertySetter(op);
    } else {
      validateNamedPropertySetter(op);
    }
  } else {
    validateNamedPropertyDeleter(op);
  }
}
