/**
 * Synthetic factories for WebIDL `Member` instances (attributes, operations,
 * and constructor operations), used by tests.
 *
 * The library does not ship runtime constructors for member definitions
 * (per spec, `Attribute` and `Operation` are purely interfaces). These
 * helpers manufacture plain objects that conform to each interface so
 * the validators and predicates can be exercised in isolation. The
 * `*Steps` methods are inert stubs — validation never invokes them.
 */
import type {
  Attribute,
  ConstructorOperation,
  Identifier,
  Operation,
  Type,
} from "lib/webidl";

export function makeAttribute<T extends Type>(options: {
  type: T;
  identifier?: Identifier;
  keywords?: string[];
  extendedAttributes?: Attribute["extendedAttributes"];
  getterSteps?: Attribute<T>["getterSteps"];
  setterSteps?: Attribute<T>["setterSteps"];
}): Attribute<T> {
  const keywords = new Set(options.keywords ?? []);

  // A read-only attribute has no setter steps; a read-write one does. Tests
  // may override either default by passing `setterSteps` explicitly (including
  // `undefined` to force a read-write attribute without them).
  const setterSteps =
    "setterSteps" in options
      ? options.setterSteps
      : keywords.has("readonly")
        ? undefined
        : () => undefined;

  return {
    kind: "attribute",
    extendedAttributes: options.extendedAttributes ?? {},
    keywords,
    identifier: options.identifier ?? "attr",
    type: options.type,
    getterSteps: options.getterSteps ?? (() => undefined),
    ...(setterSteps === undefined ? {} : { setterSteps }),
  } as Attribute<T>;
}

export function makeOperation(options: {
  identifier?: Identifier | undefined;
  keywords?: string[];
  argumentTypes?: Type[];
  returnType?: Type;
  extendedAttributes?: Operation["extendedAttributes"];
  methodSteps?: Operation["methodSteps"];
}): Operation {
  return {
    kind: "operation",
    extendedAttributes: options.extendedAttributes ?? {},
    keywords: new Set(options.keywords ?? []),
    identifier: "identifier" in options ? options.identifier : "operate",
    arguments: (options.argumentTypes ?? []).map((type) => ({ type })),
    // Every operation carries a return type. When a test does not care about
    // conversion, default to an identity converter so the runtime code that
    // applies the return type (create an operation function) has a callable.
    returnType: options.returnType ?? ((value: unknown) => value),
    methodSteps: options.methodSteps ?? (() => undefined),
  } as Operation;
}

export function makeConstructor(options: {
  argumentTypes?: Type[];
  keywords?: string[];
  constructorSteps?: ConstructorOperation["constructorSteps"];
  extendedAttributes?: ConstructorOperation["extendedAttributes"];
}): ConstructorOperation {
  return {
    kind: "constructor",
    keywords: new Set(options.keywords ?? []),
    extendedAttributes: options.extendedAttributes ?? {},
    arguments: (options.argumentTypes ?? []).map((type) => ({ type })),
    // `constructorSteps` is a constructor (`new (...) => object`): the effective
    // overload set invokes it through `new`/`Reflect.construct`. The default is a
    // trivial constructable that yields a fresh object.
    constructorSteps:
      options.constructorSteps ??
      (class {} as ConstructorOperation["constructorSteps"]),
  } as ConstructorOperation;
}
