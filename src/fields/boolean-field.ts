import { ValidationError } from "../exceptions/validation-error";
import { BaseField, BaseFieldOptions } from "./base-field";
import { ValidationIssue } from "../exceptions/validation-issue";


export class BooleanField<T extends BaseFieldOptions> extends BaseField {
    readonly TRUE_VALUES = [
        't', 'T',
        'y', 'Y', 'yes', 'Yes', 'YES',
        'true', 'True', 'TRUE',
        'on', 'On', 'ON',
        '1', 1,
        true
    ];

    readonly FALSE_VALUES = [
        'f', 'F',
        'n', 'N', 'no', 'No', 'NO',
        'false', 'False', 'FALSE',
        'off', 'Off', 'OFF',
        '0', 0, 0.0,
        false
    ];

    readonly NULL_VALUES = ['null', 'Null', 'NULL', '', null];

    constructor(options: T) {
        super(options);
    }

    public parse(value: any): T extends { allowNull: true } ? boolean | null : boolean {
        if (this.TRUE_VALUES.includes(value)) {
            return true;
        } else if (this.FALSE_VALUES.includes(value)) {
            return false;
        } else if (this.options.get('allowNull') && this.NULL_VALUES.includes(value)) {
            return null as any;
        }

        throw new ValidationError([new ValidationIssue('Must be a valid boolean.')])
    }

    public format(value: any): boolean {
        if (this.TRUE_VALUES.includes(value)) {
            return true;
        } else if (this.FALSE_VALUES.includes(value)) {
            return false;
        } else if (this.options.get('allowNull') && this.FALSE_VALUES.includes(value)) {
            return null as any;
        }

        return Boolean(value);
    }

}
