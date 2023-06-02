import { ParseIssue } from "../exceptions/parse-issue";
import { BaseFieldOptions, BaseField } from "./base-field";
import { ParseArrayReturnType } from "../types";
import { ParseError } from "../exceptions/parse-error";
import { AfterParse } from "../decorators";
import { DeferredField } from "../recursive";
import { DTObject } from "src/dt-object";


export interface ArrayOptions extends BaseFieldOptions {
    items: BaseField | DTObject;
    maxLength?: number | null;
    minLength?: number | null;
}

export class ArrayField<T extends ArrayOptions> extends BaseField {
    _options: T;

    constructor(options?: T) {
        super(options);
    }

    public async parseValue(value: any): ParseArrayReturnType<T> {
        const parsedItems: any[] = [];
        let itemField = this._options.items as BaseField;

        if (!Array.isArray(value)) {
            throw new ParseIssue(`Ensure value is an array.`)
        }

        if (itemField instanceof DeferredField) {
            itemField = itemField.construct()
        }

        for (const v of value) {
            parsedItems.push(await itemField.parseValue(v))
        }

        return parsedItems as any;
    }

    public async formatValue(value: any): Promise<any[]> {
        const formattedItems: any[] = [];
        let itemField = this._options.items as BaseField;

        if (!Array.isArray(value)) {
            return [];
        }

        if (itemField instanceof DeferredField) {
            itemField = itemField.construct()
        }

        for (const v of value) {
            const formattedValue = await itemField.formatValue(v);
            formattedItems.push(formattedValue)
        }

        return formattedItems;
    }

    @AfterParse({ receieveNull: false })
    public validateMinLength(value: any[]) {
        const minLen = this._options.minLength ?? -Infinity;

        if (minLen !== null && value.length < minLen) {
            throw new ParseError(`Ensure this field has at least ${minLen} items.`)
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMaxLength(value: any[]) {
        const maxLength = this._options.maxLength ?? Infinity;

        if (maxLength !== null && value.length > maxLength) {
            throw new ParseError(`Ensure this field has no more than ${maxLength} items.`)
        }

        return value;
    }

}