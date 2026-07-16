/**
 * Synthetic factories for WebIDL `Member` instances (attributes and
 * operations), used by tests.
 *
 * The library does not ship runtime constructors for member definitions
 * (per spec, `Attribute` and `Operation` are purely interfaces). These
 * helpers manufacture plain objects that conform to each interface so
 * the validators and predicates can be exercised in isolation. The
 * `*Steps` methods are inert stubs — validation never invokes them.
 */
import type { Attribute, Identifier, Operation, Type } from "lib/webidl";

export function makeAttribute<T extends Type>(options: {
  type: T;
  identifier?: Identifier;
  keywords?: string[];
}): Attribute<T> {
  return {
    kind: "attribute",
    keywords: new Set(options.keywords ?? []),
    identifier: options.identifier ?? "attr",
    type: options.type,
    getterSteps: () => undefined,
    setterSteps: () => undefined,
  } as unknown as Attribute<T>;
}

export function makeOperation(options: {
  identifier?: Identifier | undefined;
  keywords?: string[];
  argumentTypes?: Type[];
  returnType?: Type;
}): Operation {
  return {
    kind: "operation",
    keywords: new Set(options.keywords ?? []),
    identifier: "identifier" in options ? options.identifier : "operate",
    arguments: (options.argumentTypes ?? []).map((type) => ({ type })),
    returnType: options.returnType,
    methodSteps: () => undefined,
  } as unknown as Operation;
}
