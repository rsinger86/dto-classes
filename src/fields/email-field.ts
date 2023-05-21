import { StringField } from "./string-field";
import { REGEX_PATTERNS } from "../regex";
import { ValidationError } from "../exceptions/validation-error";
import { validate } from "../decorators";


export class EmailField extends StringField {
    @validate({ receiveEmpty: false })
    public matchesEmailPattern(value: string) {
        if (!REGEX_PATTERNS.EMAIL.test(value)) {
            throw new ValidationError('Not a valid email address.')
        }

        return value;
    }
}
