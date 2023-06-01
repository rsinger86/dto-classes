import { ArrayOptions } from "./fields/array-field";
import { BaseFieldOptions } from "./fields/base-field";


export type ParseReturnType<T, O extends BaseFieldOptions> =
    Promise<O extends { allowNull: true } ? T | null :
        O extends { required: false, allowNull: true } ? T | null | undefined :
        O extends { required: false } ? T | undefined : T>;


export type ParseArrayReturnType<T extends ArrayOptions> = ParseReturnType<Array<T['items']>, T>;

type InternalMethods = '_getParent' |
    '_asChild' |
    '_getDefaultValue' |
    '_getFieldName' |
    '_options' |
    'getValueToFormat' |
    'getValueToParse' |
    'format' |
    'parse';

export type ParseDtoReturnType<T> = Promise<Omit<T, InternalMethods>>;
