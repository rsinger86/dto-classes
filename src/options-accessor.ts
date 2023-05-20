export class OptionsAccessor<T extends { [key: string]: any }> {
    _options: T;
    _defaults: Required<T>;

    constructor(options: T, defaults: Required<T>) {
        this._options = options;
        this._defaults = defaults
    }

    get<S = T[keyof T]>(key: keyof T): S {
        if (key in this._options) {
            return this._options[key] as any;
        }

        return this._defaults[key] as any;
    }
}
