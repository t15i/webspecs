import { createBuiltinFunction } from "@ecma";
import { implementsInterface, isPromiseType, isStaticOperation } from "@webidl";
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

      // NOTE (no overloading): the JS runtime has a single signature per
      // operation, ignoring "Compute the effective overload set..."
      const operation = op.methodSteps;
      const values = op.arguments.map((argument, index) =>
        argument.type(args[index]),
      );

      let R = null;

      // TODO (Default): "If operation is declared with a [Default]
      // extended attribute..."
      R = Reflect.apply(operation, idlObject, values);

      return op.returnType(R);
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

  // NOTE (no overloading): the JS runtime has a single signature per
  // operation, ignoring "Compute the effective overload set..."
  const length = op.arguments.length;

  return createBuiltinFunction(steps, length, id!, {
    construct: false,
  });
}
