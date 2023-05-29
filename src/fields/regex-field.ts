import { ParseReturnType } from "src/types";
import { StringField, StringOptions } from "./string-field";
import { ValidationIssue } from "src/exceptions/validation-issue";
import { ValidationError } from "src/exceptions/validation-error";
import { BaseFieldDefaults } from "./base-field";
import { OptionsAccessor } from "../options-accessor";


export interface RegexFieldOptions extends StringOptions {
    pattern: RegExp
}

export class RegexField<T extends RegexFieldOptions> extends StringField {
    public options: OptionsAccessor<RegexFieldOptions>;

    constructor(options: T) {
        super(options);
        this.options = new OptionsAccessor<RegexFieldOptions>(options, {
            pattern: /^\b$/,
            allowBlank: false,
            trimWhitespace: true,
            maxLength: null,
            minLength: null,
            toUpper: false,
            toLower: false,
            ...BaseFieldDefaults
        })
    }

    public async parse(value: any): ParseReturnType<string, T> {
        value = await super.parse(value);
        let strValue: string = value;
        const pattern = this.options.get('pattern');

        if (!pattern.test(strValue)) {
            throw new ValidationError('This value does not match the required pattern.');
        }

        return value;
    }
}
