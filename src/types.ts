import { ArrayOptions } from "./fields/array-field";
import { BaseFieldOptions } from "./fields/base-field";


export type ParseReturnType<T, O extends BaseFieldOptions> =
    Promise<O extends { allowNull: true } ? T | null :
        O extends { required: false, allowNull: true } ? T | null | undefined :
        O extends { required: false } ? T | undefined : T>;


export type ParseArrayReturnType<T extends ArrayOptions> = ParseReturnType<Array<T['items']>, T>;
