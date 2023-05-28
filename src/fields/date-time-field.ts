import { BaseField, BaseFieldDefaults, BaseFieldOptions } from "./base-field";
import { ParseReturnType } from "../types";
import { OptionsAccessor } from "../options-accessor";
import { ValidationIssue } from "../exceptions/validation-issue";
import { AfterParse } from "../decorators";
import { ValidationError } from "../exceptions/validation-error";

export interface DateTimeFieldOptions extends BaseFieldOptions {
    maxDate?: Date | null;
    minDate?: Date | null;
    format?: 'iso' | '*';
}

export class DateTimeField<T extends DateTimeFieldOptions> extends BaseField {
    public options: OptionsAccessor<DateTimeFieldOptions>;

    constructor(options?: T) {
        super(options);
        this.options = new OptionsAccessor<DateTimeFieldOptions>(options ?? {}, {
            maxDate: null,
            minDate: null,
            format: 'iso',
            ...BaseFieldDefaults
        })
    }

    public parse(value: any): ParseReturnType<Date, T> {
        if (value instanceof Date) {
            return value as any;
        }


        if (typeof value !== 'string') {
            throw new ValidationIssue('Invalid date-time passed.');
        }

        const parsed = Date.parse(value);

        if (Number.isNaN(parsed)) {
            throw new ValidationIssue('Invalid date-time passed.');
        }

        return new Date(parsed) as any;
    }

    @AfterParse({ receieveNull: false })
    public validateMaxDate(value: number) {
        const maxDate = this.options.get('maxDate');

        if (maxDate !== null && value > maxDate) {
            throw new ValidationError(`Ensure the value is no more than ${maxDate}.`)
        }

        return value;
    }

    @AfterParse({ receieveNull: false })
    public validateMinDate(value: any[]) {
        const minDate = this.options.get('minDate');

        if (minDate !== null && value < minDate) {
            throw new ValidationError(`Ensure the value is at least ${minDate}.`)
        }

        return value;
    }

    public format(value: any): string | null {
        if (typeof value === 'string') {
            return value;
        } else if (value instanceof Date) {
            return value.toISOString();
        } else {
            return null;
        }
    }

}
