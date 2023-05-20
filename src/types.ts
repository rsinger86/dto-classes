export type ParseReturnType<T, Options> =
    Options extends { allowNull: true } ? T | null :
    Options extends { allowNull: true, default: T } ? T | null | Options['default'] :
    T;
