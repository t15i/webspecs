import { isValidAttributeLocalName } from "@dom";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ContentAttributeDescriptor {}

const contentAttributeDescriptors: WeakMap<
  object,
  Map<string, ContentAttributeDescriptor>
> = new WeakMap();

export interface ElementConstructor {
  /**
   * Associates a content attribute descriptor with a class of elements,
   * keyed by the constructor's prototype.
   */
  defineContentAttribute(
    constructor: {
      new (...args: never[]): Element;
      prototype: Element;
    },
    name: string,
    descriptor: ContentAttributeDescriptor,
  ): void;

  /**
   * Resolves the content attribute descriptor for an element, walking up the
   * prototype chain until a descriptor is found or the chain is exhausted.
   */
  getContentAttributeDescriptor(
    object: Element,
    name: string,
  ): ContentAttributeDescriptor | undefined;
}

export const Element: ElementConstructor = {
  defineContentAttribute(constructor, name, descriptor) {
    if (!isValidAttributeLocalName(name)) {
      throw new DOMException(
        `'${name}' is not a valid attribute local name`,
        "InvalidCharacterError",
      );
    }

    let descriptors = contentAttributeDescriptors.get(constructor.prototype);

    if (descriptors === undefined) {
      descriptors = new Map();
      contentAttributeDescriptors.set(constructor.prototype, descriptors);
    }

    descriptors.set(name, descriptor);
  },

  getContentAttributeDescriptor(object, name) {
    let current: object | null = object;

    while (current !== null) {
      const descriptor = contentAttributeDescriptors.get(current)?.get(name);

      if (descriptor !== undefined) {
        return descriptor;
      }

      current = Object.getPrototypeOf(current) as object | null;
    }

    return undefined;
  },
};
