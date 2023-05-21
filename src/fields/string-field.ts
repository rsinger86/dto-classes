import { ValidationError } from "../exceptions/validation-error";
import { BaseField, BaseFieldDefaults, BaseFieldOptions } from "./base-field";
import { OptionsAccessor } from "../options-accessor";
import { ParseReturnType } from "../types";
import { validate } from "../decorators";


export interface StringOptions extends BaseFieldOptions {
    allowBlank?: boolean;
    trimWhitespace?: boolean;
    maxLength?: number | null;
    minLength?: number | null;
    toUpper?: boolean;
    toLower?: boolean;
}

export class StringField<T extends StringOptions = StringOptions> extends BaseField {
    public options: OptionsAccessor<StringOptions>;

    constructor(options?: T) {
        super(options);
        this.options = new OptionsAccessor<StringOptions>(options ?? {}, {
            allowBlank: false,
            trimWhitespace: true,
            maxLength: null,
            minLength: null,
            toUpper: false,
            toLower: false,
            ...BaseFieldDefaults
        })
    }

    public parse(value: any): ParseReturnType<string, T> {
        const validTypes = ['number', 'string'];

        if (!validTypes.includes(typeof value)) {
            throw new ValidationError('Not a valid string.');
        }

        value = String(value) as string;

        if (this.options.get('trimWhitespace')) {
            value = value.trim();
        }

        return value;
    }

    public async parseAsync(value: any): Promise<ParseReturnType<string, T>> {
        return await this.parse(value);
    }

    @validate({ receieveNull: false })
    public validateBlankness(value: string) {
        if (!this.options.get('allowBlank') && value.length === 0) {
            throw new ValidationError('This field may not be blank.');
        }

        return value;
    }

    @validate({ receieveNull: false })
    public validateMinLength(value: string) {
        const minLen = this.options.get('minLength');

        if (minLen !== null && value.length < minLen) {
            throw new ValidationError(`Ensure this field has at least ${minLen} characters.`)
        }

        return value;
    }

    @validate({ receieveNull: false })
    public validateMaxLength(value: string) {
        const maxLength = this.options.get('maxLength');

        if (maxLength !== null && value.length > maxLength) {
            throw new ValidationError(`Ensure this field has no more than ${maxLength} characters.`)
        }

        return value;
    }

    public format(value: any): string {
        return String(value);
    }

}
