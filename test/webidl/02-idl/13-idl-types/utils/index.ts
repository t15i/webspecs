/**
 * Synthetic factories for WebIDL `Type` instances, used by tests.
 *
 * The library does not ship runtime constructors for type definitions
 * (per spec, `Type` is purely an interface with a call signature plus a
 * `name`). These helpers manufacture callable functions that conform to
 * each `XxxType` interface so the converters and predicates can be
 * exercised in isolation.
 *
 * Architecture note (per project owner):
 * `flattenedMemberTypes.has(NULLABLE_TYPE_NAME)` returns true iff
 * `includesNullableType(union)` is true. The set iteration itself does
 * not enumerate a synthetic `Nullable` member - only the flattened
 * (post-strip) member types per the spec algorithm.
 */
import {
  ANY_TYPE_NAME,
  ASYNC_SEQUENCE_TYPE_NAME,
  BIGINT_TYPE_NAME,
  BOOLEAN_TYPE_NAME,
  BYTE_STRING_TYPE_NAME,
  CALLBACK_FUNCTION_TYPE_NAME,
  CALLBACK_INTERFACE_TYPE_NAME,
  DICTIONARY_TYPE_NAME,
  DOM_STRING_TYPE_NAME,
  DOUBLE_TYPE_NAME,
  FROZEN_ARRAY_TYPE_NAME,
  getFlattenedMemberTypes,
  getNumberOfNullableMemberTypes,
  includesNullableType,
  INTERFACE_TYPE_NAME,
  AllowResizable,
  AllowShared,
  Clamp,
  EnforceRange,
  LegacyNullToEmptyString,
  LegacyTreatNonObjectAsNull,
  LONG_TYPE_NAME,
  NULLABLE_TYPE_NAME,
  NUMERIC_TYPE_NAME,
  NUMERIC_TYPE_NAMES,
  OBJECT_TYPE_NAME,
  OBSERVABLE_ARRAY_TYPE_NAME,
  PROMISE_TYPE_NAME,
  RECORD_TYPE_NAME,
  SEQUENCE_TYPE_NAME,
  STRING_TYPE_NAME,
  STRING_TYPE_NAMES,
  UNDEFINED_TYPE_NAME,
  UNION_TYPE_NAME,
  UNSIGNED_LONG_TYPE_NAME,
  USV_STRING_TYPE_NAME,
  asBigInt,
  asBoolean,
  asDOMString,
  asDouble,
  asFrozenArray,
  asInterfaceType,
  asLong,
  asNullable,
  asRecord,
  asSequence,
  asUndefined,
  asUnion,
  asUnsignedLong,
  asUSVString,
  type AnnotatedType,
  type TypeExtendedAttributes,
  type AnyType,
  type AsyncSequenceType,
  type BigIntType,
  type BooleanType,
  type ByteStringType,
  type CallbackFunctionType,
  type CallbackInterfaceType,
  type DictionaryType,
  type DOMStringType,
  type DoubleType,
  type FlattenedMemberTypes,
  type FrozenArrayType,
  type InterfaceType,
  type LongType,
  type NullableType,
  type ObjectType,
  type ObservableArrayType,
  type PromiseType,
  type RecordType,
  type SequenceType,
  type Type,
  type UndefinedType,
  type UnionType,
  type UnsignedLongType,
  type USVStringType,
  type RecordKeyType,
  PlatformObject,
  type Interface,
} from "lib/webidl";

type ExtAttrs = {
  allowResizable?: boolean;
  allowShared?: boolean;
  clamp?: boolean;
  enforceRange?: boolean;
  legacyNullToEmptyString?: boolean;
  legacyTreatNonObjectAsNull?: boolean;
};

function applyExtAttrs(fn: object, attrs?: ExtAttrs): void {
  if (!attrs) return;
  const extendedAttributes: TypeExtendedAttributes = {};
  if (attrs.allowResizable) extendedAttributes[AllowResizable] = null;
  if (attrs.allowShared) extendedAttributes[AllowShared] = null;
  if (attrs.clamp) extendedAttributes[Clamp] = null;
  if (attrs.enforceRange) extendedAttributes[EnforceRange] = null;
  if (attrs.legacyNullToEmptyString) {
    extendedAttributes[LegacyNullToEmptyString] = null;
  }
  if (attrs.legacyTreatNonObjectAsNull) {
    extendedAttributes[LegacyTreatNonObjectAsNull] = null;
  }
  (fn as { extendedAttributes: TypeExtendedAttributes }).extendedAttributes =
    extendedAttributes;
}

function defineName(fn: object, name: string): void {
  Object.defineProperty(fn, "name", { value: name, configurable: true });
}

export function makeAnyType(): AnyType {
  const fn = function (v: unknown): unknown {
    return v;
  } as AnyType;
  defineName(fn, ANY_TYPE_NAME);
  return fn;
}

export function makeUndefinedType(): UndefinedType {
  const fn = function (this: UndefinedType, v: unknown): undefined {
    return asUndefined.call(fn, v);
  } as UndefinedType;
  defineName(fn, UNDEFINED_TYPE_NAME);
  return fn;
}

export function makeBooleanType(): BooleanType {
  const fn = function (this: BooleanType, v: unknown): boolean {
    return asBoolean.call(fn, v);
  } as BooleanType;
  defineName(fn, BOOLEAN_TYPE_NAME);
  return fn;
}

export function makeLongType(attrs?: ExtAttrs): LongType {
  const fn = function (this: LongType, v: unknown): number {
    return asLong.call(fn, v);
  } as LongType;
  defineName(fn, LONG_TYPE_NAME);
  applyExtAttrs(fn, attrs);
  return fn;
}

export function makeUnsignedLongType(attrs?: ExtAttrs): UnsignedLongType {
  const fn = function (this: UnsignedLongType, v: unknown): number {
    return asUnsignedLong.call(fn, v);
  } as UnsignedLongType;
  defineName(fn, UNSIGNED_LONG_TYPE_NAME);
  applyExtAttrs(fn, attrs);
  return fn;
}

export function makeDoubleType(): DoubleType {
  const fn = function (this: DoubleType, v: unknown): number {
    return asDouble.call(fn, v);
  } as DoubleType;
  defineName(fn, DOUBLE_TYPE_NAME);
  return fn;
}

export function makeBigIntType(): BigIntType {
  const fn = function (this: BigIntType, v: unknown): bigint {
    return asBigInt.call(fn, v);
  } as BigIntType;
  defineName(fn, BIGINT_TYPE_NAME);
  return fn;
}

export function makeDOMStringType(attrs?: ExtAttrs): DOMStringType {
  const fn = function (this: DOMStringType, v: unknown): string {
    return asDOMString.call(fn, v);
  } as DOMStringType;
  defineName(fn, DOM_STRING_TYPE_NAME);
  applyExtAttrs(fn, attrs);
  return fn;
}

export function makeByteStringType(): ByteStringType {
  const fn = function (v: unknown): string {
    return String(v);
  } as ByteStringType;
  defineName(fn, BYTE_STRING_TYPE_NAME);
  return fn;
}

export function makeUSVStringType(attrs?: ExtAttrs): USVStringType {
  const fn = function (this: USVStringType, v: unknown): string {
    return asUSVString.call(fn, v);
  } as USVStringType;
  defineName(fn, USV_STRING_TYPE_NAME);
  applyExtAttrs(fn, attrs);
  return fn;
}

export function makeObjectType(): ObjectType {
  const fn = function (v: unknown): object {
    return v as object;
  } as ObjectType;
  defineName(fn, OBJECT_TYPE_NAME);
  return fn;
}

export function makeCallbackFunctionType(
  attrs?: ExtAttrs,
): CallbackFunctionType {
  const fn = function (v: unknown): CallableFunction {
    return v as CallableFunction;
  } as CallbackFunctionType;
  defineName(fn, CALLBACK_FUNCTION_TYPE_NAME);
  applyExtAttrs(fn, attrs);
  return fn;
}

export function makeCallbackInterfaceType(): CallbackInterfaceType {
  const fn = function (v: unknown): object {
    return v as object;
  } as CallbackInterfaceType;
  defineName(fn, CALLBACK_INTERFACE_TYPE_NAME);
  return fn;
}

export function makeInterfaceType<T>(
  ctor: new (...args: unknown[]) => T,
): InterfaceType<T> {
  const fn = function (this: InterfaceType<T>, v: unknown): T {
    return asInterfaceType.call<InterfaceType<T>, [unknown], T>(fn, v);
  } as InterfaceType<T>;
  defineName(fn, INTERFACE_TYPE_NAME);
  fn.T = ctor;
  return fn;
}

export function makeDictionaryType<T = unknown>(
  convert?: (v: unknown) => Record<string, T>,
): DictionaryType<T> {
  const fn = function (v: unknown): Record<string, T> {
    if (convert) return convert(v);
    if (v === null || v === undefined) return {};
    return v as Record<string, T>;
  } as DictionaryType<T>;
  defineName(fn, DICTIONARY_TYPE_NAME);
  return fn;
}

export function makeAnnotatedType<T extends Type>(
  innerType: T,
  attrs?: ExtAttrs,
): AnnotatedType<T> {
  const fn = function (v: unknown): ReturnType<T> {
    return innerType(v) as ReturnType<T>;
  } as AnnotatedType<T>;
  fn.innerType = innerType;
  applyExtAttrs(fn, attrs);
  return fn;
}

export function makeNullableType<T extends Type>(
  innerType: T,
): NullableType<T> {
  const fn = function (
    this: NullableType<T>,
    v: unknown,
  ): ReturnType<T> | null {
    return asNullable.call(fn, v) as ReturnType<T> | null;
  } as NullableType<T>;
  defineName(fn, NULLABLE_TYPE_NAME);
  fn.innerType = innerType;
  return fn;
}

export function makeSequenceType<T extends Type>(T: T): SequenceType<T> {
  const fn = function (this: SequenceType<T>, v: unknown): ReturnType<T>[] {
    return asSequence.call(fn, v) as ReturnType<T>[];
  } as SequenceType<T>;
  defineName(fn, SEQUENCE_TYPE_NAME);
  fn.T = T;
  return fn;
}

export function makeFrozenArrayType<T extends Type>(T: T): FrozenArrayType<T> {
  const fn = function (
    this: FrozenArrayType<T>,
    v: unknown,
  ): readonly ReturnType<T>[] {
    return asFrozenArray.call(fn, v) as readonly ReturnType<T>[];
  } as FrozenArrayType<T>;
  defineName(fn, FROZEN_ARRAY_TYPE_NAME);
  fn.T = T;
  return fn;
}

export function makeAsyncSequenceType<T extends Type>(
  T: T,
): AsyncSequenceType<T> {
  const fn = function (v: unknown): unknown {
    return v;
  } as AsyncSequenceType<T>;
  defineName(fn, ASYNC_SEQUENCE_TYPE_NAME);
  fn.T = T;
  return fn;
}

export function makeObservableArrayType<T extends Type>(
  T: T,
): ObservableArrayType<T> {
  const fn = function (v: unknown): ReturnType<T>[] {
    return v as ReturnType<T>[];
  } as ObservableArrayType<T>;
  defineName(fn, OBSERVABLE_ARRAY_TYPE_NAME);
  fn.T = T;
  return fn;
}

export function makePromiseType<T extends Type>(T: T): PromiseType<T> {
  const fn = function (v: unknown): Promise<ReturnType<T>> {
    return Promise.resolve(v as ReturnType<T>);
  } as PromiseType<T>;
  defineName(fn, PROMISE_TYPE_NAME);
  fn.T = T;
  return fn;
}

export function makeRecordType<K extends RecordKeyType, V extends Type>(
  K: K,
  V: V,
): RecordType<K, V> {
  const fn = function (
    this: RecordType<K, V>,
    v: unknown,
  ): Record<ReturnType<K>, ReturnType<V>> {
    return asRecord.call(fn as unknown as RecordType<K, V>, v) as Record<
      ReturnType<K>,
      ReturnType<V>
    >;
  } as RecordType<K, V>;
  defineName(fn, RECORD_TYPE_NAME);
  fn.K = K;
  fn.V = V;
  return fn;
}

function buildFlattenedMemberTypes<T extends Type>(
  union: UnionType<T>,
): FlattenedMemberTypes<T> {
  const flat = getFlattenedMemberTypes(union) as T[];
  const nullableIncluded = includesNullableType(union);

  const matchGroup = (groupName: string, name: string): boolean => {
    if (groupName === STRING_TYPE_NAME) {
      return STRING_TYPE_NAMES.has(name);
    }
    if (groupName === NUMERIC_TYPE_NAME) {
      return NUMERIC_TYPE_NAMES.has(name);
    }
    return false;
  };

  return Object.defineProperties(flat, {
    has: {
      value(query: unknown): boolean {
        if (query === NULLABLE_TYPE_NAME) return nullableIncluded;
        if (typeof query === "string") {
          return flat.some(
            (U) => U.name === query || matchGroup(query, U.name),
          );
        }
        return flat.includes(query as T);
      },
    },
    get: {
      value(name: string): unknown {
        return flat.find((U) => U.name === name || matchGroup(name, U.name));
      },
    },
  }) as unknown as FlattenedMemberTypes<T>;
}

export function makeUnionType<T extends Type>(memberTypes: T[]): UnionType<T> {
  const fn = function (this: UnionType<T>, v: unknown): ReturnType<T> {
    return asUnion.call(
      fn as UnionType<Type<ReturnType<T>>>,
      v,
    ) as ReturnType<T>;
  } as UnionType<T>;
  defineName(fn, UNION_TYPE_NAME);
  fn.memberTypes = memberTypes;
  fn.numberOfNullableMemberTypes = getNumberOfNullableMemberTypes(fn);
  fn.flattenedMemberTypes = buildFlattenedMemberTypes(fn);
  return fn;
}

const platformObjects: WeakMap<object, Interface> = new WeakMap();

function getPrimaryInterfaceOf(obj: object): Interface | undefined;
function getPrimaryInterfaceOf(obj: PlatformObject): Interface;
function getPrimaryInterfaceOf(obj: object) {
  return platformObjects.get(obj) as Interface;
}

PlatformObject.getPrimaryInterfaceOf = getPrimaryInterfaceOf;

export function makePlatformObject(id: string = "Unnamed"): PlatformObject {
  const obj = {};

  platformObjects.set(obj, {
    identifier: id,
    extendedAttributes: {},
    members: {},
    staticMembers: {},
  });

  return obj as PlatformObject;
}
