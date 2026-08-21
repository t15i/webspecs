import {
  getMethod,
  hasArrayBufferDataInternalSlot,
  hasDataViewInternalSlot,
  hasStringDataInternalSlot,
  hasTypedArrayNameInternalSlot,
  isBigInt,
  isBoolean,
  isCallable,
  isNumber,
  isObject,
} from "@ecma";
import {
  ANY_TYPE_NAME,
  ASYNC_SEQUENCE_TYPE_NAME,
  BIGINT_TYPE_NAME,
  BOOLEAN_TYPE_NAME,
  CALLBACK_FUNCTION_TYPE_NAME,
  CALLBACK_INTERFACE_TYPE_NAME,
  createSequenceFromIterable,
  DICTIONARY_TYPE_NAME,
  getDistinguishingArgumentIndex,
  includesNullableType,
  isDeclaredWithDefaultValue,
  isInterfaceType,
  isPlatformObject,
  isSequenceType,
  NUMERIC_TYPE_NAME,
  OBJECT_TYPE_NAME,
  RECORD_TYPE_NAME,
  SEQUENCE_TYPE_NAME,
  STRING_TYPE_NAME,
  getInnermostType,
} from "@webidl";
import type {
  Argument,
  ConstructorOperationEffectiveOverload,
  ConstructorOperationEffectiveOverloadSet,
  ConstructorOperationEffectiveOverloadSetCallable,
  EffectiveOverloadSet,
  OperationEffectiveOverload,
  OperationEffectiveOverloadSet,
  OperationEffectiveOverloadSetCallable,
  SequenceType,
  Type,
} from "@webidl";

import { leafTypes, typeIncludes } from "./utils";

type Entry = OperationEffectiveOverload | ConstructorOperationEffectiveOverload;

const MISSING = Symbol("missing");

function omittedArgumentValue(argument: Argument): unknown {
  return isDeclaredWithDefaultValue(argument) ? argument.defaultValue : MISSING;
}

/**
 * The interface branch of the distinguishing step, decided the way the union
 * conversion decides it: an entry matches when the value is an instance of an
 * interface type at that position, or when the value is a platform object and
 * the position holds `object`.
 *
 * @see https://webidl.spec.whatwg.org/#js-union
 */
function isPlatformObjectMatchedBy(T: Type, V: unknown): boolean {
  if (isPlatformObject(V) && typeIncludes(T, OBJECT_TYPE_NAME)) {
    return true;
  }

  return leafTypes(T).some((U) => isInterfaceType(U) && V instanceof U.T);
}

function includesAnyOf(T: Type, names: string[]): boolean {
  return names.some((name) => typeIncludes(T, name));
}

/**
 * Narrows the entries to those whose type at the distinguishing argument index
 * accepts the value, following the cascade of the overload resolution
 * algorithm. Returns the surviving entries, and the iterator method already
 * fetched when a sequence type decided the match.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 */
function distinguish(
  entries: Entry[],
  i: number,
  V: unknown,
): { entries: Entry[]; method: unknown } {
  const matching = (predicate: (T: Type) => boolean): Entry[] | undefined => {
    const found = entries.filter((entry) => predicate(entry[1][i]!));
    return found.length === 0 ? undefined : found;
  };

  if (V === undefined) {
    const optional = entries.filter((entry) => entry[2][i] === "optional");
    if (optional.length !== 0) {
      return { entries: optional, method: undefined };
    }
  }

  if (V === null || V === undefined) {
    const found = matching(
      (T) => includesNullableType(T) || typeIncludes(T, DICTIONARY_TYPE_NAME),
    );
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  const platformObject = matching((T) => isPlatformObjectMatchedBy(T, V));
  if (platformObject) {
    return { entries: platformObject, method: undefined };
  }

  // TODO: no ArrayBuffer / SharedArrayBuffer / DataView / typed-array IDL types
  // exist yet, so only the "object" sub-branch of each is handled here, as in
  // the union conversion. Add their own sub-branches when those types land.
  if (
    hasArrayBufferDataInternalSlot(V) ||
    hasDataViewInternalSlot(V) ||
    hasTypedArrayNameInternalSlot(V)
  ) {
    const found = matching((T) => typeIncludes(T, OBJECT_TYPE_NAME));
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isCallable(V)) {
    const found = matching((T) =>
      includesAnyOf(T, [CALLBACK_FUNCTION_TYPE_NAME, OBJECT_TYPE_NAME]),
    );
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isObject(V)) {
    const asyncSequence = matching((T) =>
      typeIncludes(T, ASYNC_SEQUENCE_TYPE_NAME),
    );
    if (
      asyncSequence &&
      !(
        hasStringDataInternalSlot(V) &&
        entries.some((entry) => typeIncludes(entry[1][i]!, STRING_TYPE_NAME))
      )
    ) {
      const method =
        getMethod(V, Symbol.asyncIterator) ?? getMethod(V, Symbol.iterator);
      if (method !== undefined) {
        return { entries: asyncSequence, method };
      }
    }

    const sequence = matching((T) => typeIncludes(T, SEQUENCE_TYPE_NAME));
    if (sequence) {
      const method = getMethod(V, Symbol.iterator);
      if (method !== undefined) {
        return { entries: sequence, method };
      }
    }

    const objectLike = matching((T) =>
      includesAnyOf(T, [
        CALLBACK_INTERFACE_TYPE_NAME,
        DICTIONARY_TYPE_NAME,
        RECORD_TYPE_NAME,
        OBJECT_TYPE_NAME,
      ]),
    );
    if (objectLike) {
      return { entries: objectLike, method: undefined };
    }
  }

  if (isBoolean(V)) {
    const found = matching((T) => typeIncludes(T, BOOLEAN_TYPE_NAME));
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isNumber(V)) {
    const found = matching((T) => typeIncludes(T, NUMERIC_TYPE_NAME));
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isBigInt(V)) {
    const found = matching((T) => typeIncludes(T, BIGINT_TYPE_NAME));
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  for (const name of [
    STRING_TYPE_NAME,
    NUMERIC_TYPE_NAME,
    BOOLEAN_TYPE_NAME,
    BIGINT_TYPE_NAME,
    ANY_TYPE_NAME,
  ]) {
    const found = matching((T) => typeIncludes(T, name));
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  throw TypeError(`No overload accepts the argument passed at index ${i}.`);
}

export function resolveOverloads(
  S: ConstructorOperationEffectiveOverloadSet,
  args: unknown[],
): [ConstructorOperationEffectiveOverloadSetCallable, unknown[]];

export function resolveOverloads(
  S: OperationEffectiveOverloadSet,
  args: unknown[],
): [OperationEffectiveOverloadSetCallable, unknown[]];

/**
 * The spec appends the special value "missing" for an omitted optional argument
 * that was not declared with a default value. The value list is applied to the
 * method steps as a JS argument list, where "not provided" already has a
 * faithful representation — being absent from that list — so a trailing run of
 * "missing" is dropped rather than materialised. That keeps the two cases
 * apart: an argument declared with the `undefined` default value occupies its
 * position, while one declared without a default does not.
 *
 * A "missing" with a value after it cannot be dropped without shifting that
 * value into its place, and there is no rule that an optional argument is
 * followed only by other optional arguments — `f(optional long a, long b)` is a
 * legal declaration. Those keep their position and are passed as undefined.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 */
export function resolveOverloads(
  S: ConstructorOperationEffectiveOverloadSet | OperationEffectiveOverloadSet,
  args: unknown[],
) {
  const entries: Entry[] = [...S];

  if (entries.length === 0) {
    throw TypeError("The effective overload set is empty.");
  }

  const lengths = entries.map(([, typeList]) => typeList.length);

  const maxarg = Math.max(...lengths);
  const n = args.length;
  const argcount = Math.min(maxarg, n);

  let candidates = entries.filter(
    ([, typeList]) => typeList.length === argcount,
  );

  if (candidates.length === 0) {
    const required = Math.min(...lengths);

    if (n < required) {
      throw TypeError(
        `At least ${required} argument${
          required === 1 ? "" : "s"
        } required, but only ${n} passed`,
      );
    }

    // The argument counts the entries accept need not be contiguous, so a count
    // above the shortest allowable invocation can still match no entry.
    throw TypeError(`No overload takes ${n} arguments.`);
  }

  let d = -1;
  let method: unknown = undefined;

  if (candidates.length > 1) {
    d = getDistinguishingArgumentIndex(
      new Set(candidates) as EffectiveOverloadSet,
    );
  }

  const values: unknown[] = [];
  let i = 0;

  // The entries agree on their types and optionality values before the
  // distinguishing argument index, so any of them describes this prefix.
  while (i < d) {
    const V = args[i];
    const [callable, typeList, optionalityList] = candidates[0]!;

    if (optionalityList[i] === "optional" && V === undefined) {
      values.push(omittedArgumentValue(callable.arguments[i]!));
    } else {
      values.push(typeList[i]!(V));
    }

    i += 1;
  }

  if (i === d) {
    ({ entries: candidates, method } = distinguish(candidates, i, args[i]));
  }

  const [callable, typeList, optionalityList] = candidates[0]!;

  if (i === d && method !== undefined) {
    const T = getInnermostType(typeList[i]!);

    if (isSequenceType(T)) {
      values.push(
        createSequenceFromIterable(
          (T as SequenceType).T,
          args[i] as Iterable<unknown>,
        ),
      );
      i += 1;
    }
  }

  while (i < argcount) {
    const V = args[i];

    if (optionalityList[i] === "optional" && V === undefined) {
      values.push(omittedArgumentValue(callable.arguments[i]!));
    } else {
      values.push(typeList[i]!(V));
    }

    i += 1;
  }

  // The arguments the callable declares beyond those the call supplied are all
  // optional — an entry with a shorter type list only exists because every
  // argument past its end can be omitted — so each contributes its default
  // value.
  while (i < callable.arguments.length) {
    values.push(omittedArgumentValue(callable.arguments[i]!));

    i += 1;
  }

  while (values.length > 0 && values[values.length - 1] === MISSING) {
    values.pop();
  }

  for (let j = 0; j < values.length; ++j) {
    if (values[j] === MISSING) {
      values[j] = undefined;
    }
  }

  return [callable, values] as
    | [OperationEffectiveOverloadSetCallable, unknown[]]
    | [ConstructorOperationEffectiveOverloadSetCallable, unknown[]];
}
