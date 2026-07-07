export function isCallable(arg: unknown): arg is CallableFunction {
  return typeof arg === "function";
}
