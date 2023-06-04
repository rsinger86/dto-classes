import { ParseError } from "../exceptions/parse-error";
import { BaseField, BaseFieldOptions } from "./base-field";
import { ParseIssue } from "../exceptions/parse-issue";
import { ParseReturnType } from "../types";


export class BooleanField<T extends BaseFieldOptions = BaseFieldOptions> extends BaseField {
    _options: T;

    readonly TRUE_VALUES = ['t', 'T', 'y', 'Y', 'yes', 'Yes', 'YES', 'true', 'True', 'TRUE', 'on', 'On', 'ON', '1', 1, true];

    readonly FALSE_VALUES = ['f', 'F', 'n', 'N', 'no', 'No', 'NO', 'false', 'False', 'FALSE', 'off', 'Off', 'OFF', '0', 0, 0.0, false];

    readonly NULL_VALUES = ['null', 'Null', 'NULL', '', null];

    constructor(options?: T) {
        super(options);
    }

    public async parseValue(value: any): ParseReturnType<boolean, T> {
        if (this.TRUE_VALUES.includes(value)) {
            return true as any;
        } else if (this.FALSE_VALUES.includes(value)) {
            return false as any;
        } else if (this._options.allowNull && this.NULL_VALUES.includes(value)) {
            return null as any;
        }

        throw new ParseError([new ParseIssue('Must be a valid boolean.')])
    }

    public async formatValue(value: any): Promise<boolean> {
        if (this.TRUE_VALUES.includes(value)) {
            return true;
        } else if (this.FALSE_VALUES.includes(value)) {
            return false;
        } else if (this._options.allowNull && this.NULL_VALUES.includes(value)) {
            return null as any;
        }

        return Boolean(value);
    }

}
