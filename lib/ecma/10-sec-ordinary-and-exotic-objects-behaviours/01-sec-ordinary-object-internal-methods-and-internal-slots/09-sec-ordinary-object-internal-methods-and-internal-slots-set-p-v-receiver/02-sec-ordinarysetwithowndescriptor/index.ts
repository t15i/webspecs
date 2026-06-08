import {
  createDataProperty,
  isAccessorDescriptor,
  isDataDescriptor,
} from "@ecma";

export function ordinarySetWithOwnDescriptor<T>(
  obj: object,
  propertyKey: string | symbol,
  value: T,
  receiver: unknown,
  ownDesc: PropertyDescriptor | undefined,
): boolean {
  if (ownDesc === undefined) {
    const parent = Object.getPrototypeOf(obj);

    if (parent !== null) {
      return Reflect.set(obj, propertyKey, value, receiver);
    }

    ownDesc = { writable: true, enumerable: true, configurable: true };
  }

  if (isDataDescriptor(ownDesc)) {
    if (ownDesc.writable === false) {
      return false;
    }

    if (!(receiver instanceof Object)) {
      return false;
    }

    const existingDescriptor = Reflect.getOwnPropertyDescriptor(
      receiver,
      propertyKey,
    );

    if (existingDescriptor === undefined) {
      return createDataProperty(receiver, propertyKey, value);
    }

    if (isAccessorDescriptor(existingDescriptor)) {
      return false;
    }

    const valueDesc: PropertyDescriptor = { value };

    return Reflect.defineProperty(receiver, propertyKey, valueDesc);
  }

  const setter = ownDesc.set;

  if (setter === undefined) {
    return false;
  }

  setter.call(receiver, value);

  return true;
}
