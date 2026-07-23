import {
  isAnnotatedType,
  isAnnotatedWithExtAttribute,
  isDictionaryType,
  isNullableType,
  isUnionType,
  LegacyTreatNonObjectAsNull,
  type InterfaceType,
  type NullableType,
  type Type,
  type UnionType,
} from "@webidl";

import {
  ASYNC_SEQUENCE_TYPE_NAME,
  BIGINT_TYPE_NAME,
  BOOLEAN_TYPE_NAME,
  CALLBACK_FUNCTION_TYPE_NAME,
  DICTIONARY_TYPE_NAME,
  DOM_STRING_TYPE_NAME,
  DOUBLE_TYPE_NAME,
  FROZEN_ARRAY_TYPE_NAME,
  includesNullableType,
  INTERFACE_TYPE_NAME,
  LONG_TYPE_NAME,
  NUMERIC_TYPE_NAME,
  OBJECT_TYPE_NAME,
  SEQUENCE_TYPE_NAME,
  STRING_TYPE_NAME,
  UNDEFINED_TYPE_NAME,
  UNSIGNED_LONG_TYPE_NAME,
  USV_STRING_TYPE_NAME,
} from "../../13-idl-types";

export const INTERFACELIKE_DISTINCTION_CATEGORIES = "interface-like";
export const DICTIONARYLIKE_DISTINCTION_CATEGORIES = "dictionary-like";
export const SEQUENCELIKE_DISTINCTION_CATEGORIES = "sequence-like";

export const DISTINCTION_CATEGORY: Map<string, string> = new Map([
  [LONG_TYPE_NAME, NUMERIC_TYPE_NAME],
  [UNSIGNED_LONG_TYPE_NAME, NUMERIC_TYPE_NAME],
  [DOUBLE_TYPE_NAME, NUMERIC_TYPE_NAME],
  [DOM_STRING_TYPE_NAME, STRING_TYPE_NAME],
  [USV_STRING_TYPE_NAME, STRING_TYPE_NAME],
  [INTERFACE_TYPE_NAME, INTERFACELIKE_DISTINCTION_CATEGORIES],
  [DICTIONARY_TYPE_NAME, DICTIONARYLIKE_DISTINCTION_CATEGORIES],
  [SEQUENCE_TYPE_NAME, SEQUENCELIKE_DISTINCTION_CATEGORIES],
  [FROZEN_ARRAY_TYPE_NAME, SEQUENCELIKE_DISTINCTION_CATEGORIES],
]);

export const DISTINCTION_TABLE: Map<
  string,
  Map<string, boolean | typeof isDistinguishable>
> = new Map([
  [
    UNDEFINED_TYPE_NAME,
    new Map([
      [UNDEFINED_TYPE_NAME, false],
      [DICTIONARYLIKE_DISTINCTION_CATEGORIES, false],
    ]),
  ],
  [BOOLEAN_TYPE_NAME, new Map([[BOOLEAN_TYPE_NAME, false]])],
  [NUMERIC_TYPE_NAME, new Map([[NUMERIC_TYPE_NAME, false]])],
  [BIGINT_TYPE_NAME, new Map([[BIGINT_TYPE_NAME, false]])],
  [STRING_TYPE_NAME, new Map([[STRING_TYPE_NAME, false]])],
  [
    OBJECT_TYPE_NAME,
    new Map([
      [OBJECT_TYPE_NAME, false],
      [INTERFACELIKE_DISTINCTION_CATEGORIES, false],
      [CALLBACK_FUNCTION_TYPE_NAME, false],
      [DICTIONARYLIKE_DISTINCTION_CATEGORIES, false],
      [ASYNC_SEQUENCE_TYPE_NAME, false],
      [SEQUENCELIKE_DISTINCTION_CATEGORIES, false],
    ]),
  ],
  [
    INTERFACELIKE_DISTINCTION_CATEGORIES,
    new Map<string, boolean | typeof isDistinguishable>([
      [
        INTERFACELIKE_DISTINCTION_CATEGORIES,
        function (first, second) {
          return !(
            (first as InterfaceType).T.prototype instanceof
              (second as InterfaceType).T ||
            (second as InterfaceType).T.prototype instanceof
              (first as InterfaceType).T
          );
        },
      ],
    ]),
  ],
  [
    CALLBACK_FUNCTION_TYPE_NAME,
    new Map<string, boolean | typeof isDistinguishable>([
      [CALLBACK_FUNCTION_TYPE_NAME, false],
      [
        DICTIONARYLIKE_DISTINCTION_CATEGORIES,
        function (first) {
          return isAnnotatedWithExtAttribute(first, LegacyTreatNonObjectAsNull);
        },
      ],
    ]),
  ],
  [
    DICTIONARYLIKE_DISTINCTION_CATEGORIES,
    new Map([[DICTIONARYLIKE_DISTINCTION_CATEGORIES, false]]),
  ],
  [
    ASYNC_SEQUENCE_TYPE_NAME,
    new Map([
      [ASYNC_SEQUENCE_TYPE_NAME, false],
      [SEQUENCELIKE_DISTINCTION_CATEGORIES, false],
    ]),
  ],
  [
    SEQUENCELIKE_DISTINCTION_CATEGORIES,
    new Map([[SEQUENCELIKE_DISTINCTION_CATEGORIES, false]]),
  ],
]);

export function getInnermostType(T: Type): Type {
  if (isAnnotatedType(T)) T = T.innerType;
  if (isNullableType(T)) T = T.innerType;
  return T;
}

function getDistinctionTableKey(T: Type) {
  const innermostName = getInnermostType(T).name;

  if (DISTINCTION_TABLE.has(innermostName)) {
    return innermostName;
  }

  if (DISTINCTION_CATEGORY.has(innermostName)) {
    const innermostCategoryName = DISTINCTION_CATEGORY.get(innermostName)!;

    if (DISTINCTION_TABLE.has(innermostCategoryName)) {
      return innermostCategoryName;
    }
  }

  return undefined;
}

function isUnionOrNullableUnionType(
  T: Type,
): T is UnionType | NullableType<UnionType> {
  return isUnionType(T) || (isNullableType(T) && isUnionType(T.innerType));
}

function isNotDistinguishableWithIncludingNullable(T: Type): boolean {
  return !(
    includesNullableType(T) ||
    (isUnionType(T) && T.flattenedMemberTypes.has(DICTIONARY_TYPE_NAME)) ||
    isDictionaryType(T)
  );
}

function isDistinguishableUnionAndT(
  one: UnionType | NullableType<UnionType>,
  other: Type,
): boolean {
  const union = isUnionType(one) ? one : one.innerType;
  return union.memberTypes.every((memberType) =>
    isDistinguishable(memberType, other),
  );
}

function isDistinguishableUnions(
  one: UnionType | NullableType<UnionType>,
  other: UnionType | NullableType<UnionType>,
) {
  const oneUnion = isUnionType(one) ? one : one.innerType;
  const otherUnion = isUnionType(other) ? other : other.innerType;
  return oneUnion.memberTypes.every((oneMemberType) =>
    otherUnion.memberTypes.every((otherMemberType) =>
      isDistinguishable(oneMemberType, otherMemberType),
    ),
  );
}

export function isDistinguishable(first: Type, second: Type): boolean {
  if (
    includesNullableType(first) &&
    isNotDistinguishableWithIncludingNullable(second)
  ) {
    return false;
  }
  if (
    includesNullableType(second) &&
    isNotDistinguishableWithIncludingNullable(first)
  ) {
    return false;
  }

  if (isUnionOrNullableUnionType(first) && isUnionOrNullableUnionType(second)) {
    return isDistinguishableUnions(first, second);
  }

  if (isUnionOrNullableUnionType(first)) {
    return isDistinguishableUnionAndT(first, second);
  }
  if (isUnionOrNullableUnionType(second)) {
    return isDistinguishableUnionAndT(second, first);
  }

  const firstKey = getDistinctionTableKey(first);
  const secondKey = getDistinctionTableKey(second);

  if (firstKey !== undefined && secondKey !== undefined) {
    if (!DISTINCTION_TABLE.get(firstKey)!.has(secondKey)) {
      if (DISTINCTION_TABLE.get(secondKey)!.has(firstKey)) {
        [first, second] = [second, first];
      }
    }

    const distinguishable: boolean | typeof isDistinguishable =
      DISTINCTION_TABLE.get(firstKey)!.get(secondKey) ?? true;

    if (typeof distinguishable === "function") {
      return distinguishable(first, second);
    }

    return distinguishable;
  }

  return false;
}
