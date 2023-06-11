import { ArrayOptions } from "./fields/array-field";
import { BaseField, BaseFieldOptions } from "./fields/base-field";

type InternalMethods = '_getParent' |
    '_asChild' |
    'getDefaultParseValue' |
    '_getFieldName' |
    '_options' |
    '_getValueToFormat' |
    'format' |
    'parse';

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

type PartialPromise<T> = Partial<T>;


export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;


export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type StaticBindReturnType<
    T extends typeof BaseField, O extends BaseFieldOptions
> = O extends { items: any } ? ParseArrayReturnType<O> :
    O extends { oneOf: any } ? ParseOneOfReturnType<O> :
    O extends { anyOf: any } ? ParseAnyOfReturnType<O> :
    ParseReturnType<ReturnType<InstanceType<T>['parseValue']>, O>;


export type ParseReturnType<T, O extends BaseFieldOptions> =
    Promise<
        (
            O extends { allowNull: true } ? T | null :
            O extends { required: false, allowNull: true } ? T | null | undefined :
            O extends { required: false } ? T | undefined : T
        )
    >;


export type ParseArrayReturnType<T extends ArrayOptions> = ParseReturnType<Array<T['items']>, T>;

export type ParseOneOfReturnType<
    T extends BaseFieldOptions & { oneOf: unknown[] }
> = ParseReturnType<ArrayElement<T['oneOf']>, T>;

export type ParseAnyOfReturnType<
    T extends BaseFieldOptions & { anyOf: unknown[] }
> = ParseReturnType<ArrayElement<T['anyOf']>, T>;


export type ParseCombineReturnType<O extends BaseFieldOptions> =
    Promise<O extends { oneOf: any } ? ParseOneOfReturnType<O> :
        O extends { anyOf: any } ? ParseAnyOfReturnType<O> : never>;

export type ParseDtoReturnType<T> = Promise<Omit<T, InternalMethods>>;
