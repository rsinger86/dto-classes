import { StringField } from "./string-field";
import { REGEX_PATTERNS } from "../regex";
import { ValidationError } from "../exceptions/validation-error";
import { AfterParse } from "../decorators";


export class EmailField extends StringField {
    @AfterParse()
    public matchesEmailPattern(value: string) {
        if (!REGEX_PATTERNS.EMAIL.test(value)) {
            throw new ValidationError('Not a valid email address.')
        }

        return value;
    }
}
