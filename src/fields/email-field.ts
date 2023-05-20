import { ParseReturnType } from "src/types";
import { StringField, StringFieldOptions } from "./string-field";
import { REGEX_PATTERNS } from "src/regex";
import { ValidationIssue } from "src/exceptions/validation-issue";
import { ValidationError } from "src/exceptions/validation-error";



export class EmailField<T extends StringFieldOptions> extends StringField {
    public parse(value: any): ParseReturnType<string, T> {
        const issues: ValidationIssue[] = [];
        value = super.parse(value);

        if (value !== null) {
            let strValue: string = value;
            if (!REGEX_PATTERNS.EMAIL.test(strValue)) {
                issues.push(new ValidationIssue('Not a valid email address.'))
            }
        }

        if (issues.length > 0) {
            throw new ValidationError(issues);
        }

        return value;
    }
}
