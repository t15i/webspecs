import {
  isDOMStringType,
  isStaticOperation,
  isUnsignedLongType,
  validateOperation,
} from "@webidl";
import type { Operation, Type } from "@webidl";

/** https://webidl.spec.whatwg.org/#dfn-special-operation */
export function isSpecialOperation(op: Operation): boolean {
  return (
    op.keywords.has("getter") ||
    op.keywords.has("setter") ||
    op.keywords.has("deleter")
  );
}

export function validateSpecialOperation(op: Operation): void {
  validateOperation(op);

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

  const isIndexOrNameType = (type: Type): boolean =>
    isUnsignedLongType(type) || isDOMStringType(type);

  if (op.keywords.has("getter")) {
    if (
      op.arguments.length !== 1 ||
      !isIndexOrNameType(op.arguments[0]!.type)
    ) {
      throw TypeError(
        `A getter must take a single "unsigned long" or "DOMString" argument.`,
      );
    }
  }

  if (op.keywords.has("setter")) {
    if (
      op.arguments.length !== 2 ||
      !isIndexOrNameType(op.arguments[0]!.type)
    ) {
      throw TypeError(
        `A setter must take an "unsigned long" or "DOMString" argument followed by a value argument.`,
      );
    }
  }

  if (op.keywords.has("deleter")) {
    if (op.arguments.length !== 1 || !isDOMStringType(op.arguments[0]!.type)) {
      throw TypeError(`A deleter must take a single "DOMString" argument.`);
    }
  }
}
