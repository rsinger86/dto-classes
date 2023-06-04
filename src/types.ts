import { ArrayOptions } from "./fields/array-field";
import { BaseFieldOptions } from "./fields/base-field";

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

type PartialIfOptionSet<T, O extends BaseFieldOptions> = O extends { partial: true } ? PartialPromise<T> : T;

export type ParseReturnType<T, O extends BaseFieldOptions> =
    Promise<
        (
            O extends { allowNull: true } ? T | null :
            O extends { required: false, allowNull: true } ? T | null | undefined :
            O extends { required: false } ? T | undefined : T
        )
    >;


export type ParseArrayReturnType<T extends ArrayOptions> = ParseReturnType<Array<T['items']>, T>;



export type ParseDtoReturnType<T> = Promise<Omit<T, InternalMethods>>;
