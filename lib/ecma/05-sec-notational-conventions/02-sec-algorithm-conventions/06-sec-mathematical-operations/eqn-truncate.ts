import { R } from "./R";

/** @see https://tc39.es/ecma262/#eqn-truncate */
export function truncate(x: number): number {
  x = R(x);
  return R(Math.trunc(x));
}
