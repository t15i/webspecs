import {
  BIGINT_TYPE_NAME,
  NUMERIC_TYPE_NAME,
  type Type,
} from "../../13-idl-types";

import { DISTINCTION_CATEGORY, getInnermostType } from "./dfn-distinguishable";
import { getDistinguishingArgumentIndex } from "./dfn-distinguishing-argument-index";
import type { EffectiveOverloadSetOptionalityValue } from "./dfn-optionality-value";
import type {
  ConstructorOperationEffectiveOverloadSetCallable,
  LegacyFactoryFunctionEffectiveOverloadSetCallable,
  OperationEffectiveOverloadSetCallable,
} from "./effective-overload-set-tuple-callable";
import type { EffectiveOverloadSetEffectiveTypeList } from "./type-list";

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type EffectiveOverloadSet =
  | OperationEffectiveOverloadSet
  | ConstructorOperationEffectiveOverloadSet
  | LegacyFactoryFunctionEffectiveOverloadSet;

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type OperationEffectiveOverloadSet = Set<OperationEffectiveOverload>;

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type ConstructorOperationEffectiveOverloadSet =
  Set<ConstructorOperationEffectiveOverload>;

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type LegacyFactoryFunctionEffectiveOverloadSet =
  Set<LegacyFactoryFunctionEffectiveOverload>;

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type OperationEffectiveOverload = [
  OperationEffectiveOverloadSetCallable,
  EffectiveOverloadSetEffectiveTypeList,
  EffectiveOverloadSetOptionalityValue[],
];

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type ConstructorOperationEffectiveOverload = [
  ConstructorOperationEffectiveOverloadSetCallable,
  EffectiveOverloadSetEffectiveTypeList,
  EffectiveOverloadSetOptionalityValue[],
];

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export type LegacyFactoryFunctionEffectiveOverload = [
  LegacyFactoryFunctionEffectiveOverloadSetCallable,
  EffectiveOverloadSetEffectiveTypeList,
  EffectiveOverloadSetOptionalityValue[],
];

type Entry =
  | OperationEffectiveOverload
  | ConstructorOperationEffectiveOverload
  | LegacyFactoryFunctionEffectiveOverload;

/** @see https://webidl.spec.whatwg.org/#limit-bigint-numeric-overloading */
function isBigIntType(T: Type): boolean {
  return getInnermostType(T).name === BIGINT_TYPE_NAME;
}

/** @see https://webidl.spec.whatwg.org/#limit-bigint-numeric-overloading */
function isNumericType(T: Type): boolean {
  return (
    DISTINCTION_CATEGORY.get(getInnermostType(T).name) === NUMERIC_TYPE_NAME
  );
}

/** @see https://webidl.spec.whatwg.org/#limit-bigint-numeric-overloading */
function validateBigIntNumericOverloading(entries: Entry[], d: number): void {
  const types = entries.map(([, typeList]) => typeList[d]!);

  if (types.some(isBigIntType) && types.some(isNumericType)) {
    throw TypeError(
      "An effective overload set must not contain more than one item with the same type list size, where one item has a bigint argument at the distinguishing argument index and another has a numeric type argument at the distinguishing argument index.",
    );
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-distinguishing-argument-index */
function validateArgumentsBeforeDistinguishingIndex(
  entries: Entry[],
  d: number,
): void {
  const [first] = entries as [Entry, ...Entry[]];

  for (let j = 0; j < d; ++j) {
    for (const [, typeList, optionalityList] of entries) {
      if (typeList[j] !== first[1][j]) {
        throw TypeError(
          `The types at index ${j} of the items of an effective overload set with a given type list size must be the same, because that index is before their distinguishing argument index.`,
        );
      }

      if (optionalityList[j] !== first[2][j]) {
        throw TypeError(
          `The optionality values at index ${j} of the items of an effective overload set with a given type list size must be the same, because that index is before their distinguishing argument index.`,
        );
      }
    }
  }
}

/** @see https://webidl.spec.whatwg.org/#dfn-effective-overload-set */
export function validateEffectiveOverloadSet(S: EffectiveOverloadSet): void {
  const bySize = new Map<number, Entry[]>();

  for (const entry of S as ReadonlySet<Entry>) {
    const size = entry[1].length;
    const entries = bySize.get(size);

    if (entries === undefined) {
      bySize.set(size, [entry]);
    } else {
      entries.push(entry);
    }
  }

  for (const entries of bySize.values()) {
    if (entries.length < 2) {
      continue;
    }

    const d = getDistinguishingArgumentIndex(
      new Set(entries) as EffectiveOverloadSet,
    );

    validateArgumentsBeforeDistinguishingIndex(entries, d);
    validateBigIntNumericOverloading(entries, d);
  }
}
