import { getAllPropertyNames } from "../utils";
import { ValidationError } from "../exceptions/validation-error";
import { ValidationIssue } from "../exceptions/validation-issue";
import { OptionsAccessor } from "../options-accessor";
import { ValidateMethodOptions } from "../decorators";


export interface BaseFieldOptions {
    required?: boolean;
    allowNull?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    source?: string;
    default?: any;
}

export const BaseFieldDefaults = {
    required: true,
    allowNull: false,
    source: '',
    readOnly: false,
    writeOnly: false,
    default: undefined
};



export class BaseField<T extends BaseFieldOptions = BaseFieldOptions>  {
    public options: OptionsAccessor<BaseFieldOptions>;
    private _parent: BaseField;
    private _fieldName: string;

    constructor(options: BaseFieldOptions = {}) {
        this.options = new OptionsAccessor<BaseFieldOptions>(options, BaseFieldDefaults);
        const originalParse = this.parse;

        this.parse = (value) => {
            value = this.beforeParse(value);

            if (value !== null && value !== undefined) {
                value = originalParse.apply(this, [value]);
            }

            value = this.afterParse(value);
            return value;
        };
    }

    public clone() {
        const ThisClass = this.constructor as any;
        return new ThisClass(this.options.getRaw());
    }

    public asChild(parent: BaseField, fieldName: string) {
        this._parent = parent;
        this._fieldName = fieldName;
    }

    get name(): string {
        return this._fieldName;
    }

    public getParent(): BaseField {
        return this._parent;
    }

    public getValueToParse(rawData: any, fieldName: string) {
        return rawData;
    }

    public getValueToFormat(internalObject: any) {
        return internalObject;
    }

    protected validatePossibleNullValue(value: any) {
        if (value === null && !this.options.get('allowNull')) {
            throw new ValidationError([new ValidationIssue('This field may not be null.')]);
        }

        return value;
    }

    public beforeParse(value: any) {
        value = this.validatePossibleNullValue(value);

        for (const propName of getAllPropertyNames(this)) {
            const property = this[propName]

            if (!property || !property['__isPreparser']) {
                continue;
            }

            const validateMethod = property;
            value = validateMethod.apply(this, [value])
        }

        return value;

    }

    public parse(value: NonNullable<any>) {
        return value;
    }

    public afterParse(value: string) {
        for (const propName of getAllPropertyNames(this)) {
            const property = this[propName]

            if (!property || !property['__isPostParser']) {
                continue;
            }

            const options: ValidateMethodOptions = property['__PostParserOptions'];
            const validateMethod = property;
            const isNull = value === null;
            const isEmpty = (value === '' || value === null || value === undefined);

            if (isEmpty && options.receiveEmpty === false) {
                continue;
            } else if (isNull && options.receieveNull === false) {
                continue;
            }

            value = validateMethod.apply(this, [value]);
        }

        return value;
    }

    public format(value: any) {
        return value;
    }

    static bind<
        T extends typeof BaseField,
        C extends ConstructorParameters<T>[0]
    >(
        this: T,
        args?: C
    ):
        C extends { required: false, allowNull: true } ?
        ReturnType<InstanceType<T>['parse']> | undefined | null :
        C extends { allowNull: true } ?
        ReturnType<InstanceType<T>['parse']> | null :
        C extends { required: false } ?
        ReturnType<InstanceType<T>['parse']> | undefined :
        ReturnType<InstanceType<T>['parse']> {
        return new this(args ?? {} as any) as any;
    }

}