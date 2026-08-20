import { createBuiltinFunction } from "@ecma";
import {
  computeEffectiveOverloadSet,
  implementsInterface,
  isPromiseType,
  isStaticOperation,
  resolveOverloads,
} from "@webidl";
import type { Interface, Operation } from "@webidl";

/**
 * Creates the function that implements an operation.
 *
 * @see https://webidl.spec.whatwg.org/#dfn-create-operation-function
 */
export function createOperationFunction(
  op: Operation,
  // TODO (namespace): a namespace or interface
  target: Interface,
): (...args: unknown[]) => unknown {
  const id = op.identifier;

  const steps = function (this: unknown, ...args: unknown[]): unknown {
    try {
      let idlObject: object | null = null;

      if (
        // TODO (namespace): "target is an interface"
        !isStaticOperation(op)
      ) {
        const jsValue = this ?? globalThis;

        // TODO (security check): "If jsValue is a platform object,
        // then perform a security check..."

        if (!implementsInterface(this, target)) {
          throw TypeError("Illegal invocation");
        }

        idlObject = jsValue;
      }

      const S = computeEffectiveOverloadSet(
        isStaticOperation(op) ? "static" : "regular",
        id!,
        args.length,
        target,
      );

      try {
        const [operation, values] = resolveOverloads(S, args);

        let R = null;

        // TODO (Default): "If operation is declared with a [Default]
        // extended attribute..."
        R = Reflect.apply(operation.methodSteps, idlObject, values);

        return op.returnType(R);
      } catch (e) {
        if (e instanceof TypeError) {
          e.message = `Failed to execute '${id}' on '${target.identifier}': ${e.message}`;
          throw e;
        }
        throw TypeError(`Failed to execute '${id}' on '${target.identifier}'`, {
          cause: e,
        });
      }
    } catch (error) {
      // Per spec the check is on the operation's return type directly ("if op
      // has a return type that is a promise type"); a promise type is never
      // nullable or annotated, so no innermost-type unwrapping is needed.
      if (isPromiseType(op.returnType)) {
        return Promise.reject(error);
      }
      throw error;
    }
  };

  let length = op.arguments.length;
  for (const [, typeList] of computeEffectiveOverloadSet(
    isStaticOperation(op) ? "static" : "regular",
    id!,
    0,
    target,
  )) {
    length = Math.min(length, typeList.length);
  }

  return createBuiltinFunction(steps, length, id!, {
    construct: false,
  });
}
