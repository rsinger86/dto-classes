import { getAllPropertyNames } from "../utils";
import { ParseError } from "../exceptions/parse-error";
import { ParseIssue } from "../exceptions/parse-issue";
import { BeforeParse, IS_POST_PARSER_KEY, IS_PREPARSER_KEY, POST_PARSER_OPTIONS_KEY, ValidateMethodOptions } from "../decorators";
import { StaticBindReturnType } from "../types";


export interface BaseFieldOptions {
    items?: any;
    required?: boolean;
    allowNull?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    default?: any;
    partial?: boolean;
    formatSource?: string | null;
    context?: { [key: string]: any };
    ignoreInput?: boolean;
}


export class BaseField {
    public readonly _options: BaseFieldOptions;

    private _parent: BaseField | null = null;
    private _fieldName: string = '';

    constructor(options: BaseFieldOptions = {}) {
        this._options = options ?? {};
        const originalParse = this.parseValue;

        this.parseValue = async (value) => {
            value = await this._beforeParse(value);

            if (value === undefined) {
                if (this._options.partial) {
                    return undefined;
                } else {
                    return await this.getDefaultParseValue();
                }
            } else if (value !== null) {
                value = await originalParse.apply(this, [value]);
            }

            value = await this._afterParse(value);
            return value;
        };
    }

    protected _clone() {
        const ThisClass = this.constructor as any;
        return new ThisClass(this._options);
    }

    public get _context(): { [key: string]: any } {
        return this._options.context ?? {};
    }

    public _asChild(parent: BaseField, fieldName: string, options: BaseFieldOptions = {}) {
        this._parent = parent;
        this._fieldName = fieldName;
        // @ts-ignore
        this._options = { ...this._options, ...options };
    }

    public _getFieldName(): string {
        return this._fieldName;
    }

    public _getParent(): BaseField | null {
        return this._parent;
    }

    public async getDefaultParseValue(): Promise<any> {
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

    protected async _beforeParse(value: any) {
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

    protected async _afterParse(value: string) {
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

    public _getValueToFormat(internalObject: any): any {
        const source = this._options.formatSource ?? this._fieldName;
        return internalObject[source] ?? null;
    }

    @BeforeParse()
    protected validateNull(value: any) {
        if (value === null && !this._options.allowNull) {
            throw new ParseError([new ParseIssue('This field may not be null.')]);
        }

        return value;
    }

    @BeforeParse()
    protected validateUndefined(value: any) {
        const isRequired = this._options.required ?? true;
        const hasDefault = this._options.default !== undefined
        const isPartialValidation = this._options.partial === true

        if (isPartialValidation) {
            return value;
        }

        if (value === undefined && isRequired && !hasDefault) {
            throw new ParseError([new ParseIssue('This field is required.')]);
        }

        return value;
    }

    public async parseValue(value: NonNullable<any>): Promise<any> {
        return value;
    }

    public async formatValue(value: any): Promise<any> {
        return String(value);
    }

    static bind<
        T extends typeof BaseField,
        C extends ConstructorParameters<T>[0] & {}
    >(
        this: T,
        args?: C
    ):
        Awaited<StaticBindReturnType<T, C>> {
        return new this(args ?? {} as any) as any;
    }

    static async parse<
        T extends typeof BaseField,
        C extends ConstructorParameters<T>[0] & {}
    >(
        this: T,
        data: any,
        args?: C
    ): Promise<StaticBindReturnType<T, C>> {
        const instance = new this(args ?? {} as any) as any;
        return await instance.parseValue(data);
    }

    static async format<
        T extends typeof BaseField,
        C extends ConstructorParameters<T>[0] & {}
    >(
        this: T,
        internalObj: any,
        args?: C
    ): Promise<{ [key: string]: any }> {
        const instance = new this(args ?? {} as any) as any;
        return await instance.formatValue(internalObj);
    }

}