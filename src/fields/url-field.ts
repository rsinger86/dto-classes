import { ParseReturnType } from "src/types";
import { StringField, StringFieldOptions } from "./string-field";
import { ValidationIssue } from "src/exceptions/validation-issue";
import { ValidationError } from "src/exceptions/validation-error";
import { REGEX_PATTERNS } from "src/regex";


export class UrlField<T extends StringFieldOptions> extends StringField {
    public parse(value: any): ParseReturnType<string, T> {
        const issues: ValidationIssue[] = [];
        value = super.parse(value);

        if (value !== null) {
            let strValue: string = value;

            if (!REGEX_PATTERNS.HTTP_URL.test(strValue)) {
                issues.push(new ValidationIssue('This value is not a valid URL.'))
            }
        }

        if (issues.length > 0) {
            throw new ValidationError(issues);
        }

        return value;
    }
}
