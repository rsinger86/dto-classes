import { BaseFieldOptions } from "./fields/base-field";

export type ParseReturnType<T, Options extends BaseFieldOptions> =
    Options extends { allowNull: true } ? T | null :
    Options extends { allowNull: true, default: T } ? T | null | Options['default'] :
    T;
