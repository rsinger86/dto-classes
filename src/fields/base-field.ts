
export interface BaseFieldOptions {
    required?: boolean;
    allowNull?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    source?: string;
}

export class BaseField {

    constructor(options: BaseFieldOptions) { }

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