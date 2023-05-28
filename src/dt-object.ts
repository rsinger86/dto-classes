import { ValidationError } from "./exceptions/validation-error";
import { OptionsAccessor } from "./options-accessor";
import { BaseField, BaseFieldOptions } from "./fields/base-field";
import { Deferred } from "./recursive";



export class DTObject extends BaseField {
    public options: OptionsAccessor<BaseFieldOptions>;
    private _fields: Array<BaseField | DTObject> = [];

    constructor(options?: BaseFieldOptions) {
        super(options ?? {});
    }

    private get allFields(): Array<BaseField | DTObject> {
        if (this._fields.length > 0) {
            return this._fields;
        }

        const fields: Array<BaseField | DTObject> = []

        for (const attrName of Object.keys(this)) {
            if (attrName === '_parent') {
                continue;
            }

            let attribute = this[attrName];

            if (attribute instanceof BaseField) {
                if (attribute instanceof Deferred) {
                    attribute = (attribute as any).construct()
                }

                const clonedField = attribute.clone();
                clonedField.asChild(this, attrName);
                fields.push(clonedField)
            }
        }

        this._fields = fields;
        return this._fields;
    }

    private getFieldsToParse(): Array<BaseField> {
        return this.allFields.filter(x => {
            return x.options.get('readOnly') !== true;
        });
    }

    private getFieldsToFormat(): Array<BaseField> {
        return this.allFields.filter(x => {
            return x.options.get('writeOnly') !== true;
        });
    }

    public parse(rawObject: object): this {
        const errors: ValidationError[] = [];

        for (const field of this.getFieldsToParse()) {
            const fieldName = field.getFieldName();
            const rawValue = rawObject ? rawObject[fieldName] : undefined;

            try {
                this[fieldName] = field.parse(rawValue)
            } catch (e) {
                this[fieldName] = undefined;
                if (e instanceof ValidationError) {
                    e.addParentPath(fieldName);
                    errors.push(e)
                } else {
                    throw e;
                }
            }
        }

        if (errors.length > 0) {
            throw ValidationError.combine(errors);
        }

        return this;
    }


    public format(internalObj: any): { [key: string]: any } {
        const formatted = {};

        for (const field of this.getFieldsToFormat()) {
            const fieldName = field.getFieldName();
            const internalValue = field.getValueToFormat(internalObj);
            formatted[fieldName] = field.format(internalValue);
        }

        return formatted;
    }

}