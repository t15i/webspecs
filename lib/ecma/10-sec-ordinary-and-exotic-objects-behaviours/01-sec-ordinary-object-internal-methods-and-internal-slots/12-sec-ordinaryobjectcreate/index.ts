/** @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-ordinaryobjectcreate */
export function ordinaryObjectCreate(proto: object | null): object {
  return Object.create(proto);
}
