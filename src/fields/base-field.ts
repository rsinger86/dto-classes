import { OptionsAccessor } from "src/options-accessor";

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
    protected options: OptionsAccessor<BaseFieldOptions>;

    constructor(options: BaseFieldOptions) {
        this.options = new OptionsAccessor<BaseFieldOptions>(options, BaseFieldDefaults);
    }

    public getValueToParse(rawData: any) {

    }

    public getValueToFormat(internalObject: any) {

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
        args: C
    ):
        C extends { required: false, allowNull: true } ?
        ReturnType<InstanceType<T>['parse']> | undefined | null :
        C extends { allowNull: true } ?
        ReturnType<InstanceType<T>['parse']> | null :
        C extends { required: false } ?
        ReturnType<InstanceType<T>['parse']> | undefined :
        ReturnType<InstanceType<T>['parse']> {
        return new this(args as any) as any;
    }

}