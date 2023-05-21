import { ValidationIssue } from "../exceptions/validation-issue";
import { OptionsAccessor } from "../options-accessor";

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

export class BaseField {
    public options: OptionsAccessor<BaseFieldOptions>;
    private _parent: BaseField;
    private _fieldName: string;

    constructor(options: BaseFieldOptions = {}) {
        this.options = new OptionsAccessor<BaseFieldOptions>(options, BaseFieldDefaults);
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

    get parent(): BaseField {
        return this._parent;
    }

    public getValueToParse(rawData: any, fieldName: string) {
        return rawData;
    }

    public getValueToFormat(internalObject: any) {
        return internalObject;
    }

    public throwIfNullAndNotAllowed(value: any) {
        if (value === null && !this.options.get('allowNull')) {
            throw new ValidationIssue('This field may not be null.');
        }
    }

    public parse(value: any) {

    }

    public format(value: any) {

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