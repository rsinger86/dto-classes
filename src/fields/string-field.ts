import { ValidationError } from "../exceptions/validation-error";
import { BaseField, BaseFieldDefaults, BaseFieldOptions } from "./base-field";
import { ValidationIssue } from "../exceptions/validation-issue";
import { OptionsAccessor } from "../options-accessor";
import { ParseReturnType } from "../types";


export interface StringFieldOptions extends BaseFieldOptions {
    allowBlank?: boolean;
    trimWhitespace?: boolean;
    maxLength?: number | null;
    minLength?: number | null;
    toUpper?: boolean;
    toLower?: boolean;
}

export class StringField<T extends StringFieldOptions = StringFieldOptions> extends BaseField {
    public options: OptionsAccessor<StringFieldOptions>;

    constructor(options?: T) {
        super(options);
        this.options = new OptionsAccessor<StringFieldOptions>(options ?? {}, {
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
        const issues: ValidationIssue[] = [];

        if (value === null) {
            if (!this.options.get('allowNull')) {
                issues.push(new ValidationIssue('This field may not be null.'))
            } else {
                return null as any;
            }
        }

        const validTypes = ['number', 'string'];

        if (!validTypes.includes(typeof value)) {
            issues.push(new ValidationIssue('Not a valid string.'))
        }

        if (issues.length === 0) {
            value = String(value) as string;

            if (this.options.get('trimWhitespace')) {
                value = value.trim();
            }

            if (!this.options.get('allowBlank') && value.length === 0) {
                issues.push(new ValidationIssue('This field may not be blank.'))
            }

            const minLen = this.options.get('minLength');
            const maxLength = this.options.get('maxLength');

            if (minLen !== null && value.length < minLen) {
                issues.push(new ValidationIssue(`Ensure this field has at least ${minLen} characters.`))
            }

            if (maxLength !== null && value.length > maxLength) {
                issues.push(new ValidationIssue(`Ensure this field has no more than ${maxLength} characters.`))
            }
        }

        if (issues.length > 0) {
            throw new ValidationError(issues);
        }

        return value;
    }

    public async parseAsync(value: any): Promise<ParseReturnType<string, T>> {
        return await this.parse(value);
    }

    public format(value: any): string {
        return String(value);
    }

}
