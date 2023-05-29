import { ValidationError } from "./exceptions/validation-error";
import { BaseField, BaseFieldOptions } from "./fields/base-field";
import { DeferredField } from "./recursive";
import { getAllPropertyNames, isKeyableObject } from "./utils";



export class DTObject extends BaseField {
    public _options: any;

    private _fields: Array<BaseField | DTObject> = [];

    constructor(options?: BaseFieldOptions) {
        super(options ?? {});
    }

    private get allFields(): Array<BaseField> {
        if (this._fields.length > 0) {
            return this._fields;
        }

        const fields: Array<BaseField> = []

        for (const attrName of Object.keys(this)) {
            if (attrName === '_parent') {
                continue;
            }

            let attribute = this[attrName];

            if (attribute instanceof BaseField || attribute instanceof DeferredField) {
                if (attribute instanceof DeferredField) {
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

    private getFormatterMethods(): Function[] {
        const methods: Function[] = [];

        for (const propName of getAllPropertyNames(this)) {
            const property = this[propName] as any;

            if (property && property['__isFormatter']) {
                methods.push(property);
            }
        }

        return methods;
    }

    private getFieldsToParse(): Array<BaseField> {
        return this.allFields.filter(x => {
            return x._options.readOnly !== true;
        });
    }

    private getFieldsToFormat(): Array<BaseField> {
        return this.allFields.filter(x => {
            return x._options.writeOnly !== true;
        });
    }

    public async parse(rawObject: object): Promise<this> {
        const errors: ValidationError[] = [];

        for (const field of this.getFieldsToParse()) {
            const fieldName = field.getFieldName();
            const rawValue = rawObject ? rawObject[fieldName] : undefined;

            try {
                this[fieldName] = await field.parse(rawValue)
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

    public async format(internalObj: any): Promise<{ [key: string]: any }> {
        const formatted = {};

        for (const field of this.getFieldsToFormat()) {
            const fieldName = field.getFieldName();

            if (isKeyableObject(internalObj)) {
                const internalValue = await field.getValueToFormat(internalObj);
                formatted[fieldName] = await field.format(internalValue);
            } else {
                formatted[fieldName] = null;
            }
        }

        for (const formatter of this.getFormatterMethods()) {
            const fieldName = formatter['__FormatterOptions']['fieldName']
            formatted[fieldName] = await formatter.apply(this, [internalObj]);
        }

        return formatted;
    }

    public static async parseNew<T extends DTObject>(this: new (...args: any[]) => T, data: object) {
        return await new this().parse(data)
    }

}
