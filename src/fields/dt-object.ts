import { ValidationError } from "../exceptions/validation-error";
import { OptionsAccessor } from "../options-accessor";
import { BaseField, BaseFieldOptions } from "./base-field";



export class DTObject extends BaseField {
    public options: OptionsAccessor<BaseFieldOptions>;
    private _fields: Array<BaseField | DTObject> = [];

    constructor(options: BaseFieldOptions) {
        super(options);
    }

    private get allFields(): Array<BaseField | DTObject> {
        if (this._fields.length > 0) {
            return this._fields;
        }

        const fields: Array<BaseField | DTObject> = []

        for (const attrName of Object.keys(this)) {
            const attribute = this[attrName];

            if (attribute instanceof BaseField) {
                const clonedField = attribute.clone();
                clonedField.asChild(this, attrName);
                fields.push(clonedField)
            }
        }
        this._fields = fields;
        return this._fields;
    }

    private getFieldsToParse(): Array<BaseField | DTObject> {
        return this.allFields.filter(x => {
            return x.options.get('readOnly') !== true;
        });
    }

    public parse(rawObject: object): this {
        const errors = [];

        for (const field of this.getFieldsToParse()) {
            const rawValue = rawObject[field.name] ?? null;

            try {
                this[field.name] = field.parse(rawValue)
            } catch (e) {
                this[field.name] = undefined;
                if (e instanceof ValidationError) {
                    errors.push()
                } else {
                    throw e;
                }
            }
        }

        if (errors.length > 0) {
        }

        return this;
    }



}