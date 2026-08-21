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
  createSequenceFromIterable,
  getDistinguishingArgumentIndex,
  getInnermostType,
  includesNullableType,
  isAnnotatedType,
  isAnyType,
  isAsyncSequenceType,
  isBigIntType,
  isBooleanType,
  isCallbackFunctionType,
  isCallbackInterfaceType,
  isDeclaredWithDefaultValue,
  isDictionaryType,
  isInterfaceType,
  isNumericType,
  isObjectType,
  isPlatformObject,
  isRecordType,
  isSequenceType,
  isStringType,
  isUnionType,
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

type Entry = OperationEffectiveOverload | ConstructorOperationEffectiveOverload;

const MISSING = Symbol("missing");

function omittedArgumentValue(argument: Argument): unknown {
  return isDeclaredWithDefaultValue(argument) ? argument.defaultValue : MISSING;
}

/**
 * "there is an entry in S that has one of the following types at position i of
 * its type list" — the phrase every step of the distinguishing argument is
 * built on. Each of them names
 * its own types and then the same three ways one of them may be wrapped: a
 * nullable version of it, an annotated type whose inner type is it, and a union
 * type — nullable or annotated — carrying it among its flattened member types.
 * Those are looked through here, so a step names only its own types.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 */
function having(
  entries: Entry[],
  i: number,
  accepts: (T: Type) => boolean,
): Entry[] | undefined {
  const found = entries.filter((entry) => {
    const T = getInnermostType(entry[1][i]!);

    return isUnionType(T) ? T.flattenedMemberTypes.some(accepts) : accepts(T);
  });

  return found.length === 0 ? undefined : found;
}

/**
 * Decides the "V is a platform object then ..." step of the overload resolution
 * algorithm, the same question the union conversion asks of its own member
 * types, and answered the same way.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm
 *
 * The spec phrases this step as:
 *
 *     If V is a platform object, and there is an entry in S that has one of the
 *     following types at position i of its type list,
 *       - an interface type that V implements
 *       - object
 *     then remove from S all other entries.
 *
 * NOTE: Both are gated behind "V is a platform object", and that guard is kept
 * only by the second, for the reason `asUnion` sets out at length: an arbitrary
 * object cannot be told to be a *built-in* platform object without an
 * exhaustive enumeration of every such type. The interface branch is therefore
 * decided solely by `V instanceof T.T`, and a type occupying an interface slot
 * which is not in fact a platform object could have V accepted where the spec
 * would reject it. The two steps are one question, so they are left to agree
 * rather than made to differ here.
 */
function isPlatformObjectAndTypeIsObjectOrInterfaceTypeImplementedBy(
  T: Type,
  V: unknown,
): boolean {
  if (isPlatformObject(V) && isObjectType(T)) {
    return true;
  }

  return isInterfaceType(T) && V instanceof T.T;
}

/** @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm */
function distinguish(
  entries: Entry[],
  i: number,
  V: unknown,
): { entries: Entry[]; method: CallableFunction | undefined } {
  if (V === undefined) {
    const found = entries.filter((entry) => entry[2][i] === "optional");
    if (found.length !== 0) {
      return { entries: found, method: undefined };
    }
  }

  if (V === null || V === undefined) {
    const found = entries.filter((entry) => {
      const T = entry[1][i]!;
      const U = isAnnotatedType(T) ? T.innerType : T;

      return (
        includesNullableType(U) ||
        isDictionaryType(U) ||
        (isUnionType(U) && U.flattenedMemberTypes.some(isDictionaryType))
      );
    });

    if (found.length !== 0) {
      return { entries: found, method: undefined };
    }
  }

  const platformObject = having(entries, i, (T) =>
    isPlatformObjectAndTypeIsObjectOrInterfaceTypeImplementedBy(T, V),
  );
  if (platformObject) {
    return { entries: platformObject, method: undefined };
  }

  // TODO: no ArrayBuffer / DataView / typed-array IDL types exist yet, so only
  // the "there is an entry in S that has one of the following types: object"
  // branch is implemented.
  if (hasArrayBufferDataInternalSlot(V)) {
    const found = having(entries, i, isObjectType);
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (hasDataViewInternalSlot(V)) {
    const found = having(entries, i, isObjectType);
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  // Likewise: the typed array types are not modelled as IDL types.
  if (hasTypedArrayNameInternalSlot(V)) {
    const found = having(entries, i, isObjectType);
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isCallable(V)) {
    const found = having(
      entries,
      i,
      (T) => isCallbackFunctionType(T) || isObjectType(T),
    );
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isObject(V)) {
    const found = having(entries, i, isAsyncSequenceType);
    const isStringObjectAgainstAStringType =
      hasStringDataInternalSlot(V) &&
      having(entries, i, isStringType) !== undefined;

    if (found && !isStringObjectAgainstAStringType) {
      const method =
        getMethod(V, Symbol.asyncIterator) ?? getMethod(V, Symbol.iterator);
      if (method !== undefined) {
        return { entries: found, method };
      }
    }
  }

  if (isObject(V)) {
    const found = having(entries, i, isSequenceType);
    if (found) {
      const method = getMethod(V, Symbol.iterator);
      if (method !== undefined) {
        return { entries: found, method };
      }
    }
  }

  if (isObject(V)) {
    const found = having(
      entries,
      i,
      (T) =>
        isCallbackInterfaceType(T) ||
        isDictionaryType(T) ||
        isRecordType(T) ||
        isObjectType(T),
    );
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isBoolean(V)) {
    const found = having(entries, i, isBooleanType);
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isNumber(V)) {
    const found = having(entries, i, isNumericType);
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  if (isBigInt(V)) {
    const found = having(entries, i, isBigIntType);
    if (found) {
      return { entries: found, method: undefined };
    }
  }

  const string = having(entries, i, isStringType);
  if (string) {
    return { entries: string, method: undefined };
  }

  const numeric = having(entries, i, isNumericType);
  if (numeric) {
    return { entries: numeric, method: undefined };
  }

  const boolean = having(entries, i, isBooleanType);
  if (boolean) {
    return { entries: boolean, method: undefined };
  }

  const bigint = having(entries, i, isBigIntType);
  if (bigint) {
    return { entries: bigint, method: undefined };
  }

  // Unreachable: this step is only taken with more than one entry left,
  // which means every pair of them is distinguishable at this index, and `any`
  // is distinguishable from no type at all.
  /* istanbul ignore next -- see above */
  const any = having(entries, i, isAnyType);
  /* istanbul ignore next -- see above */
  if (any) {
    return { entries: any, method: undefined };
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

/** @see https://webidl.spec.whatwg.org/#dfn-overload-resolution-algorithm */
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

    throw TypeError(`No overload takes ${n} arguments.`);
  }

  let d = -1;
  let method: CallableFunction | undefined = undefined;

  if (candidates.length > 1) {
    d = getDistinguishingArgumentIndex(
      new Set(candidates) as EffectiveOverloadSet,
    );
  }

  const values: unknown[] = [];
  let i = 0;

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

  // The spec asserts the type is a sequence type here, but the step that
  // fetches a method for an async sequence type reaches this point too, and
  // there is nothing to create for one: an async sequence value is the object
  // itself, as the union conversion also leaves it. Only a sequence type is
  // built here; anything else is converted by the loop below, like any other
  // argument.
  if (i === d && method !== undefined) {
    const T = getInnermostType(typeList[i]!);

    if (isSequenceType(T)) {
      values.push(
        createSequenceFromIterable((T as SequenceType).T, args[i], method),
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

  // The arguments the callable declares beyond those the call supplied are
  // all optional: an entry with a shorter type list only exists because every
  // argument past its end can be omitted, so each contributes its default value.
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
