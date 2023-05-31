import { ValidationError } from "../exceptions/validation-error";
import { BaseField, BaseFieldOptions } from "./base-field";
import { ParseReturnType } from "../types";
import { AfterParse } from "../decorators";
import { REGEX_PATTERNS } from "../regex";


export interface StringOptions extends BaseFieldOptions {
    allowBlank?: boolean;
    trimWhitespace?: boolean;
    maxLength?: number | null;
    minLength?: number | null;
    pattern?: RegExp,
    format?: 'email' | 'url'
}

export class StringField<T extends StringOptions = StringOptions> extends BaseField {
    public _options: StringOptions;

    constructor(options?: T) {
        super(options);
    }

    public async parse(value: any): ParseReturnType<string, T> {
        const validTypes = ['number', 'string'];

        if (!validTypes.includes(typeof value)) {
            throw new ValidationError('Not a valid string.');
        }

        value = String(value) as string;
        const trimWhitespace = this._options.trimWhitespace ?? true;

        if (trimWhitespace) {
            value = value.trim();
        }

        return value;
    }

    @AfterParse()
    public validateBlankness(value: string) {
        if (!this._options.allowBlank && value.length === 0) {
            throw new ValidationError('This field may not be blank.');
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMinLength(value: string) {
        const minLen = this._options.minLength ?? null;

        if (minLen !== null && value.length < minLen) {
            throw new ValidationError(`Ensure this field has at least ${minLen} characters.`)
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMaxLength(value: string) {
        const maxLength = this._options.maxLength ?? null;

        if (maxLength !== null && value.length > maxLength) {
            throw new ValidationError(`Ensure this field has no more than ${maxLength} characters.`)
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validatePattern(value: string) {
        const pattern = this._options.pattern ?? null;

        if (pattern && !pattern.test(value)) {
            throw new ValidationError('This value does not match the required pattern.');
        }

        return value;
    }

    @AfterParse()
    public validateEmailFormat(value: string) {
        if (this._options.format === 'email' && !REGEX_PATTERNS.EMAIL.test(value)) {
            throw new ValidationError('Not a valid email address.')
        }

        return value;
    }

    @AfterParse()
    public validateUrlFormat(value: string) {
        if (this._options.format === 'url' && !REGEX_PATTERNS.HTTP_URL.test(value)) {
            throw new ValidationError('This value is not a valid URL.')
        }

        return value;
    }

    public async format(value: any): Promise<string> {
        return String(value);
    }

}
