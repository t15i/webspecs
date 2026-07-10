import {
  DICTIONARY_TYPE_NAME,
  RECORD_TYPE_NAME,
  SEQUENCE_TYPE_NAME,
  isAnnotatedType,
  isDeclaredToInheritItsGetterAttribute,
  isDictionaryType,
  isIdentifier,
  isNullableType,
  isReadonlyAttribute,
  isRecordType,
  isSequenceType,
  isStaticAttribute,
  isUnionType,
} from "@webidl";
import type { Identifier, Member, Type } from "@webidl";

/** @see https://webidl.spec.whatwg.org/#dfn-attribute */
export interface Attribute<T extends Type = Type> {
  memberType: "attribute";
  keywords: Set<string>;
  identifier: Identifier;
  type: T;
  getterSteps(): ReturnType<T>;
  setterSteps(value: ReturnType<T>): void;
}

export function isAttribute(member: Member): member is Attribute {
  return member.memberType === "attribute";
}

export function validateAttribute(attr: Attribute): void {
  if (!isIdentifier(attr.identifier)) {
    throw TypeError(
      `"${attr.identifier}" is not a valid Web IDL identifier for an attribute.`,
    );
  }

  if (isStaticAttribute(attr) && attr.identifier === "prototype") {
    throw TypeError(`A static attribute must not be named "prototype".`);
  }

  let type = attr.type;
  while (isAnnotatedType(type) || isNullableType(type)) {
    type = type.innerType;
  }

  if (
    isSequenceType(type) ||
    isDictionaryType(type) ||
    isRecordType(type) ||
    (isUnionType(type) &&
      (type.flattenedMemberTypes.has(SEQUENCE_TYPE_NAME) ||
        type.flattenedMemberTypes.has(DICTIONARY_TYPE_NAME) ||
        type.flattenedMemberTypes.has(RECORD_TYPE_NAME)))
  ) {
    throw TypeError(
      `The type of an attribute must not be a sequence, dictionary, or record type, nor a union type that has any of those as a member.`,
    );
  }

  if (
    isDeclaredToInheritItsGetterAttribute(attr) &&
    (!isReadonlyAttribute(attr) || isStaticAttribute(attr))
  ) {
    throw TypeError(
      `An attribute declared with "inherit" must be a read-only regular attribute.`,
    );
  }
}
