import { ValidationIssue } from "../exceptions/validation-issue";
import { OptionsAccessor } from "../options-accessor";
import { BaseFieldOptions, BaseField, BaseFieldDefaults } from "./base-field";
import { ParseReturnType } from "../types";
import { ValidationError } from "../exceptions/validation-error";
import { AfterParse } from "../decorators";
import { DeferredField } from "../recursive";



export interface ArrayOptions extends BaseFieldOptions {
    items: BaseField
    maxLength?: number | null;
    minLength?: number | null;
}

export class ArrayField<T extends ArrayOptions> extends BaseField {
    public options: OptionsAccessor<ArrayOptions>;

    constructor(options: T) {
        super(options);
        this.options = new OptionsAccessor<ArrayOptions>(options, {
            maxLength: null,
            minLength: null,
            items: null as any,
            ...BaseFieldDefaults
        })
    }

    public parse(value: any): ParseReturnType<Array<T['items']>, T> {
        const parsedItems: any[] = [];
        const itemField = this.options.get('items') as BaseField;

        if (!Array.isArray(value)) {
            throw new ValidationIssue(`Ensure value is an array.`)
        }

        for (const v of value) {
            parsedItems.push(itemField.parse(v))
        }

        return parsedItems as any;
    }

    public async parseAsync(value: any): Promise<ParseReturnType<Array<T['items']>, T>> {
        return await this.parse(value);
    }

    @AfterParse({ receieveNull: false })
    public validateMinLength(value: any[]) {
        const minLen = this.options.get('minLength');

        if (minLen !== null && value.length < minLen) {
            throw new ValidationError(`Ensure this field has at least ${minLen} items.`)
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMaxLength(value: any[]) {
        const maxLength = this.options.get('maxLength');

        if (maxLength !== null && value.length > maxLength) {
            throw new ValidationError(`Ensure this field has no more than ${maxLength} items.`)
        }

        return value;
    }


    public format(value: any): any[] {
        const formattedItems: any[] = [];
        let itemField = this.options.get('items') as any;

        if (!Array.isArray(value)) {
            return [];
        }

        if (itemField instanceof DeferredField) {
            itemField = itemField.construct()
        }

        for (const v of value) {
            formattedItems.push(itemField.format(v))
        }

        return formattedItems;
    }

}