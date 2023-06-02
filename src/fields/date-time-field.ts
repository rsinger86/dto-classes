import { BaseField, BaseFieldOptions } from "./base-field";
import { ParseReturnType } from "../types";
import { AfterParse } from "../decorators";
import { ParseError } from "../exceptions/parse-error";

export interface DateTimeFieldOptions extends BaseFieldOptions {
    maxDate?: Date | null;
    minDate?: Date | null;
    format?: '*';
}

export class DateTimeField<T extends DateTimeFieldOptions> extends BaseField {
    _options: T;

    constructor(options?: T) {
        super(options);
    }

    public async parseValue(value: any): ParseReturnType<Date, T> {
        if (value instanceof Date) {
            return value as any;
        }


        if (typeof value !== 'string') {
            throw new ParseError('Invalid date-time passed.');
        }

        const parsed = Date.parse(value);

        if (Number.isNaN(parsed)) {
            throw new ParseError('Invalid date-time passed.');
        }

        return new Date(parsed) as any;
    }

    @AfterParse({ receieveNull: false })
    public validateMaxDate(value: Date) {
        const maxDate = this._options.maxDate ?? null;

        if (maxDate !== null && value > maxDate) {
            throw new ParseError(`Ensure the value is no more than ${maxDate}.`)
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMinDate(value: Date) {
        const minDate = this._options.minDate ?? null;

        if (minDate !== null && value < minDate) {
            throw new ParseError(`Ensure the value is at least ${minDate}.`)
        }

        return value;
    }

    public async formatValue(value: any): Promise<string | null> {
        if (typeof value === 'string') {
            return value;
        } else if (value instanceof Date) {
            return value.toISOString();
        } else {
            return null;
        }
    }

}
