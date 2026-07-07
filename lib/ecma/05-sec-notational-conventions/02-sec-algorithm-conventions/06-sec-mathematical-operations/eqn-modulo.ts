import { R } from "./R";

export function sign(n: number): number {
  return n < 0 ? -1 : 1;
}

/** https://tc39.es/ecma262/#eqn-modulo */
export function modulo(x: number, y: number): number {
  x = R(x);
  y = R(y);
  if (y === 0) {
    throw TypeError("modulo requires non-zero y");
  }
  return R(sign(x) === sign(y) ? x % y : (x % y) + y);
}
