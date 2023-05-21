import { ValidationIssue } from "../exceptions/validation-issue";
import { OptionsAccessor } from "../options-accessor";
import { BaseFieldOptions, BaseField, BaseFieldDefaults } from "./base-field";
import { ParseReturnType } from "../types";
import { ValidationError } from "../exceptions/validation-error";



export interface ArrayFieldOptions extends BaseFieldOptions {
    item: BaseField
    maxLength?: number | null;
    minLength?: number | null;
}

export class ArrayField<T extends ArrayFieldOptions = ArrayFieldOptions> extends BaseField {
    public options: OptionsAccessor<ArrayFieldOptions>;

    constructor(options: T) {
        super(options);
        this.options = new OptionsAccessor<ArrayFieldOptions>(options, {
            maxLength: null,
            minLength: null,
            item: null as any,
            ...BaseFieldDefaults
        })
    }

    public parse(value: any): ParseReturnType<Array<T['item']>, T> {
        this.throwIfNullAndNotAllowed(value);
        const parsedItems: any[] = [];
        const itemField = this.options.get('item') as BaseField;

        if (!Array.isArray(value)) {
            throw new ValidationIssue(`Ensure value is an array.`)
        }

        const minLen = this.options.get('minLength');
        const maxLength = this.options.get('maxLength');

        if (minLen !== null && value.length < minLen) {
            throw new ValidationError(issues);
        } else if (maxLength !== null && value.length > maxLength) {
            throw new ValidationError(issues);
        }

        for (const v of value) {
            parsedItems.push(itemField.parse(v))
        }

        return parsedItems as any;
    }

    public async parseAsync(value: any): Promise<ParseReturnType<Array<T['item']>, T>> {
        return await this.parse(value);
    }

    public format(value: any): string {
        return String(value);
    }

}