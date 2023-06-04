import { FORMATTER_OPTIONS_KEY, IS_FORMATTER_KEY } from "./decorators";
import { ParseError } from "./exceptions/parse-error";
import { BaseField, BaseFieldOptions } from "./fields/base-field";
import { DeferredField } from "./recursive";
import { ParseDtoReturnType } from "./types";
import { getAllPropertyNames, isKeyableObject } from "./utils";



export class DTObject extends BaseField {
    public _options: any;
    private _parsedValues: { [key: string]: any } | null = null;
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

                const clonedField = attribute._clone();
                clonedField._asChild(this, attrName, { partial: this._options.partial ?? false });
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

            if (property && property[IS_FORMATTER_KEY]) {
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

    public getValues(): { [key: string]: any } {
        if (this._parsedValues === null) {
            throw new Error("Must call parse() before getValues()")
        }

        const plain = {};

        for (const key in this._parsedValues) {
            let value = this._parsedValues[key];

            if (value instanceof DTObject) {
                value = value.getValues();
            }

            plain[key] = value;
        }
        return plain
    }


    public async parseValue(rawObject: object): ParseDtoReturnType<this> {
        const errors: ParseError[] = [];
        this._parsedValues = {};

        for (const field of this.getFieldsToParse()) {
            const fieldName = field._getFieldName();
            const rawValue = rawObject ? rawObject[fieldName] : undefined;

            try {
                this[fieldName] = await field.parseValue(rawValue);
                this._parsedValues[fieldName] = this[fieldName];
            } catch (e) {
                this[fieldName] = undefined;
                if (e instanceof ParseError) {
                    e.addParentPath(fieldName);
                    errors.push(e)
                } else {
                    throw e;
                }
            }
        }

        if (errors.length > 0) {
            throw ParseError.combine(errors);
        }

        return this;
    }

    public async formatValue(internalObj: any): Promise<{ [key: string]: any }> {
        const formatted = {};

        for (const field of this.getFieldsToFormat()) {
            const fieldName = field._getFieldName();

            if (isKeyableObject(internalObj)) {
                const internalValue = await field.getValueToFormat(internalObj);
                formatted[fieldName] = await field.formatValue(internalValue);
            } else {
                formatted[fieldName] = null;
            }
        }

        for (const formatter of this.getFormatterMethods()) {
            const fieldName = formatter[FORMATTER_OPTIONS_KEY]['fieldName']
            formatted[fieldName] = await formatter.apply(this, [internalObj]);
        }

        return formatted;
    }

}
