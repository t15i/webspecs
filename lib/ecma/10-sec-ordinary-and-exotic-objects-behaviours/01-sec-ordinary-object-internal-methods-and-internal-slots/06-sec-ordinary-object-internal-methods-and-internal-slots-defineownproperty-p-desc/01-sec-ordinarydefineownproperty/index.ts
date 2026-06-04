export function ordinaryDefineOwnProperty(
  obj: object,
  propertyKey: PropertyKey,
  desc: PropertyDescriptor,
): boolean {
  try {
    Object.defineProperty(obj, propertyKey, desc);
    return true;
  } catch (e) {
    if (e instanceof TypeError) {
      return false;
    }
    throw e;
  }
}
