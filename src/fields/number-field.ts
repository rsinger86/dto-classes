import { BaseField, BaseFieldDefaults, BaseFieldOptions } from "./base-field";
import { ParseReturnType } from "../types";
import { OptionsAccessor } from "../options-accessor";
import { ValidationIssue } from "../exceptions/validation-issue";

export interface NumberFieldOptions extends BaseFieldOptions {
    maxValue?: number;
    minValue?: number;
}

export class NumberField<T extends NumberFieldOptions = NumberFieldOptions> extends BaseField {
    public options: OptionsAccessor<NumberFieldOptions>;

    constructor(options?: T) {
        super(options);
        this.options = new OptionsAccessor<NumberFieldOptions>(options ?? {}, {
            minValue: -Infinity,
            maxValue: Infinity,
            ...BaseFieldDefaults
        })
    }

    public parse(value: any): ParseReturnType<string, T> {
        this.throwIfNullAndNotAllowed(value);

        if (typeof value === 'string' && /^\d+/.test(value)) {
            value = parseInt(value);
        } else if (typeof value === 'string' && /^[+-]?\d+(\.\d+)?$/.test(value)) {
            value = parseFloat(value);
        } else if (typeof value === 'number') {
            value = value;
        } else {
            throw new ValidationIssue('Invalud number passed.');
        }

        return value;
    }

    public format(value: any): number {
        return value;
    }

}
