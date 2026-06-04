export function sign(n: number): number {
  return n < 0 ? -1 : 1;
}

/** https://tc39.es/ecma262/#eqn-modulo */
export function modulo(x: number, y: number): number {
  return sign(x) === sign(y) ? x % y : (x % y) + y;
}
