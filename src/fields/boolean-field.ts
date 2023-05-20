import { BaseField } from "./base-field";


export class BooleanField extends BaseField {
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


    public parse(value: any): boolean {
        if (this.TRUE_VALUES.includes(value)) {
            return true;
        } else if (this.FALSE_VALUES.includes(value)) {
            return false;
        } else if (this.NULL_VALUES.includes(value)) {
            return null as any;
        }
    }

    public format(value: any): boolean {
        return null as any;
    }

}


var booleanField = new BooleanField({})

const value = booleanField.format('')