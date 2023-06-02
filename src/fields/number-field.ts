import { BaseField, BaseFieldOptions } from "./base-field";
import { ParseReturnType } from "../types";
import { AfterParse } from "../decorators";
import { ParseError } from "../exceptions/parse-error";

export interface NumberOptions extends BaseFieldOptions {
    maxValue?: number;
    minValue?: number;
}

export class NumberField<T extends NumberOptions> extends BaseField {
    _options: T;

    constructor(options?: T) {
        super(options);
    }

    public async parseValue(value: any): ParseReturnType<number, T> {
        if (typeof value === 'string' && /^\d+$/.test(value)) {
            value = parseInt(value);
        } else if (typeof value === 'string' && /^[+-]?\d+(\.\d+)?$/.test(value)) {
            value = parseFloat(value);
        } else if (typeof value === 'number') {
            value = value;
        } else {
            throw new ParseError('Invalid number passed.');
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMaxValue(value: number) {
        const maxValue = this._options.maxValue ?? null;

        if (maxValue !== null && value > maxValue) {
            throw new ParseError(`Ensure the value is no more than ${maxValue}.`)
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMinValue(value: any) {
        const minValue = this._options.minValue ?? null;

        if (minValue !== null && value < minValue) {
            throw new ParseError(`Ensure the value is at least ${minValue}.`)
        }

        return value;
    }

    public async formatValue(value: any) {
        const v = Number(value);

        if (Number.isNaN(v)) {
            return null as any;
        }

        return v;
    }

}
