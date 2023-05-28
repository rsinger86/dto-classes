import { BaseField, BaseFieldDefaults, BaseFieldOptions } from "./base-field";
import { ParseReturnType } from "../types";
import { OptionsAccessor } from "../options-accessor";
import { ValidationIssue } from "../exceptions/validation-issue";
import { AfterParse } from "../decorators";
import { ValidationError } from "../exceptions/validation-error";

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

    public parse(value: any): ParseReturnType<number, T> {
        if (typeof value === 'string' && /^\d+$/.test(value)) {
            value = parseInt(value);
        } else if (typeof value === 'string' && /^[+-]?\d+(\.\d+)?$/.test(value)) {
            value = parseFloat(value);
        } else if (typeof value === 'number') {
            value = value;
        } else {
            throw new ValidationIssue('Invalid number passed.');
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMaxValue(value: number) {
        const maxValue = this.options.get('maxValue');

        if (maxValue !== null && value > maxValue) {
            throw new ValidationError(`Ensure the value is no more than ${maxValue}.`)
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMinValue(value: any[]) {
        const minValue = this.options.get('minValue');

        if (minValue !== null && value < minValue) {
            throw new ValidationError(`Ensure the value is at least ${minValue}.`)
        }

        return value;
    }

    public format(value: any): number {
        return value;
    }

}
