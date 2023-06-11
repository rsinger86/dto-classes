import { BaseField, BaseFieldOptions } from "./base-field";
import { DeferredField } from "../recursive";
import { ParseCombineReturnType } from "../types";
import { ParseError } from "../exceptions/parse-error";
import { ParseIssue } from "../exceptions/parse-issue";


export interface CombineOptions extends BaseFieldOptions {
    readonly oneOf?: unknown[];
    readonly anyOf?: unknown[];
}

export class CombineField<T extends CombineOptions = CombineOptions> extends BaseField {
    // @ts-ignore
    _options: T;

    constructor(options?: T) {
        super(options);

        const errorMsg = 'When using CombineField, must set `anyOf` or `oneOf`, but not both.';

        if (!this._options.anyOf && !this._options.oneOf) {
            throw Error(errorMsg)
        } else if (this._options.anyOf && this._options.oneOf) {
            throw Error(errorMsg)
        }
    }

    protected validateNull(value: any) {
        return value;
    }

    protected validateUndefined(value: any) {
        return value;
    }

    public async parseValue(value: any): ParseCombineReturnType<T> {
        const parsedItems: any[] = [];

        if (this._options.oneOf) {
            const fields = this.getSubSchemaFields(this._options.oneOf);
            return this.parseOneOf(fields, value) as any;
        } else if (this._options.anyOf) {
            const fields = this.getSubSchemaFields(this._options.anyOf);
            return this.parseAnyOf(fields, value) as any;
        }

        return parsedItems as any;
    }

    private getSubSchemaFields(fields: any[]): Array<BaseField> {
        return fields.map(x => {
            if (x instanceof DeferredField) {
                x = x.construct()
            }
            return x;
        })
    }

    private async parseAnyOf(fields: Array<BaseField>, value: any) {
        for (const field of fields) {
            try {
                value = await field.parseValue(value);
                return value;
            } catch (e) {
                if (e instanceof ParseError) {
                    // 
                } else {
                    throw e;
                }
            }
        }

        throw new ParseError([new ParseIssue('None of the subschemas matched.')])
    }

    private async parseOneOf(fields: Array<BaseField>, value: any) {
        let matchedCount = 0;
        let parsedValue = null;

        for (const field of fields) {
            try {
                parsedValue = await field.parseValue(value);
                matchedCount += 1;
            } catch (e) {
                if (e instanceof ParseError) {
                    //
                } else {
                    throw e;
                }
            }
        }

        if (matchedCount === 1) {
            return parsedValue;
        } else if (matchedCount === 0) {
            throw new ParseError([new ParseIssue('None of the subschemas matched.')])
        } else if (matchedCount > 1) {
            throw new ParseError([new ParseIssue(`Only one subschema is allowed to match, but ${matchedCount} did.`)])
        }
    }

}
