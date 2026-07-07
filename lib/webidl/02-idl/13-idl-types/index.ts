export * from "./01-idl-any";
export * from "./02-idl-undefined";
export * from "./03-idl-boolean";
export * from "./08-idl-long";
export * from "./09-idl-unsigned-long";
export * from "./14-idl-double";
export * from "./16-idl-bigint";
export * from "./17-idl-DOMString";
export * from "./18-idl-ByteString";
export * from "./19-idl-USVString";
export * from "./20-idl-object";
export * from "./22-idl-interface-type";
export * from "./23-idl-callback-interface-type";
export * from "./24-idl-dictionary";
export * from "./26-idl-callback-function-type";
export * from "./27-idl-nullable-type";
export * from "./28-idl-sequence-type";
export * from "./29-idl-async-sequence-type";
export * from "./30-idl-record-type";
export * from "./31-idl-promise-type";
export * from "./32-idl-union";
export * from "./33-idl-annotated-types";
export * from "./35-idl-frozen-array-type";
export * from "./36-idl-observable-array-type";
export * from "./dfn-numeric-type";
export * from "./dfn-string-type";

export interface Type<T = unknown> {
  (value: unknown): T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TypeMap {}
