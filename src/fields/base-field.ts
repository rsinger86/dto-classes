import { getAllPropertyNames } from "../utils";
import { ValidationError } from "../exceptions/validation-error";
import { ValidationIssue } from "../exceptions/validation-issue";
import { BeforeParse, IS_POST_PARSER_KEY, IS_PREPARSER_KEY, POST_PARSER_OPTIONS_KEY, ValidateMethodOptions } from "../decorators";
import { ParseReturnType } from "../types";


export interface BaseFieldOptions {
    items?: any;
    required?: boolean;
    allowNull?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    source?: string;
    default?: any;
    partial?: boolean;
    formatSource?: string | null;
}


export class BaseField {
    public readonly _options: BaseFieldOptions;

    private _parent: BaseField;
    private _fieldName: string;

    constructor(options?: BaseFieldOptions) {
        this._options = options ?? {};
        const originalParse = this.parse;

        this.parse = async (value) => {
            value = await this.beforeParse(value);

            if (value === undefined && !this._options.partial) {
                return this._getDefaultValue();
            }

            if (value !== undefined && value !== null) {
                value = await originalParse.apply(this, [value]);
            }

            value = await this.afterParse(value);
            return value;
        };
    }


    protected clone() {
        const ThisClass = this.constructor as any;
        return new ThisClass(this._options);
    }

    public _asChild(parent: BaseField, fieldName: string) {
        this._parent = parent;
        this._fieldName = fieldName;
    }

    public _getFieldName(): string {
        return this._fieldName;
    }

    public _getParent(): BaseField {
        return this._parent;
    }

    public _getDefaultValue(): any {
        const value = this._options.default;

        if (this._options.partial) {
            throw new Error("Cannot access default value when applying partial parsing and validation.");
        }

        if (typeof value === 'function') {
            return value();
        } else {
            return value;
        }
    }

    public getValueToParse(rawData: any, fieldName: string) {
        return rawData;
    }

    public getValueToFormat(internalObject: any): any {
        const source = this._options.formatSource ?? this._fieldName;
        return internalObject[source] ?? null;
    }

    @BeforeParse()
    protected validateNull(value: any) {
        if (value === null && !this._options.allowNull) {
            throw new ValidationError([new ValidationIssue('This field may not be null.')]);
        }

        return value;
    }

    @BeforeParse()
    protected validateUndefined(value: any) {
        const isRequired = this._options.required ?? true;
        const hasDefault = this._options.default !== undefined

        if (value === undefined && isRequired && !hasDefault) {
            throw new ValidationError([new ValidationIssue('This field is required.')]);
        }

        return value;
    }

    protected async beforeParse(value: any) {
        for (const propName of getAllPropertyNames(this)) {
            const property = this[propName]

            if (!property || !property[IS_PREPARSER_KEY]) {
                continue;
            }

            const validateMethod = property;
            const validatedValue = await validateMethod.apply(this, [value]);

            // Only assign the new value if the method returns
            if (validatedValue !== undefined) {
                value = validatedValue;
            }
        }

        return value;

    }

    protected async afterParse(value: string) {
        for (const propName of getAllPropertyNames(this)) {
            const property = this[propName]

            if (!property || !property[IS_POST_PARSER_KEY]) {
                continue;
            }

            const options: ValidateMethodOptions = property[POST_PARSER_OPTIONS_KEY];
            const validateMethod = property;
            const isNull = value === null;
            const isEmpty = (value === '' || value === null || value === undefined);
            const receiveNull = options.receieveNull ?? false;

            if (isNull && !receiveNull) {
                continue;
            }

            const validatedValue = await validateMethod.apply(this, [value]);

            // Only assign the new value if the method returns
            if (validatedValue !== undefined) {
                value = validatedValue;
            }
        }

        return value;
    }
    public async parse(value: NonNullable<any>): Promise<any> {
        return value;
    }

    public async format(value: any): Promise<any> {
        return String(value);
    }

    static bind<
        T extends typeof BaseField,
        C extends ConstructorParameters<T>[0] & {}
    >(
        this: T,
        args?: C
    ):
        Awaited<
            C extends { items: any } ?
            ParseReturnType<Array<C['items']>, C> :
            ParseReturnType<ReturnType<InstanceType<T>['parse']>, C>
        > {
        return new this(args ?? {} as any) as any;
    }

}