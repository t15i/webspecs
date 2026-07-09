import { isValidAttributeLocalName } from "@dom";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ContentAttributeDescriptor {}

const contentAttributeDescriptors: WeakMap<
  object,
  Map<string, ContentAttributeDescriptor>
> = new WeakMap();

export interface ElementConstructor {
  /**
   * Defines a content attribute by descriptor.
   *
   * @param constructor - the element constructor for which the content
   * attribute to be defined
   * @param name - the name of the content attribute to be defined
   * @param descriptor - the content attribute descriptor to be applied
   *
   * @throws DOMException("InvalidCharacterError") if `name` is not valid
   * attribute local name
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
   * Resolves the content attribute descriptor for an element.
   *
   * @param object - the object for which the content attribute descriptor to be
   * resolved
   * @param name - the name of the content attribute to be resolved
   *
   * @returns Content-attribute descriptor for the specified object and name if
   * defined, `undefined` otherwise
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

    descriptors.set(name, { ...descriptor });
  },

  getContentAttributeDescriptor(object, name) {
    let current: object | null = object;

    while (current !== null) {
      const descriptor = contentAttributeDescriptors.get(current)?.get(name);

      if (descriptor !== undefined) {
        return { ...descriptor };
      }

      current = Object.getPrototypeOf(current) as object | null;
    }

    return undefined;
  },
};
