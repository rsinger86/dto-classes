import { StringField } from "./string-field";
import { ValidationError } from "src/exceptions/validation-error";
import { REGEX_PATTERNS } from "src/regex";
import { validate } from "../decorators";


export class UrlField extends StringField {

    @validate({ receiveEmpty: false })
    public validateUrlPattern(value: string) {
        if (!REGEX_PATTERNS.HTTP_URL.test(value)) {
            throw new ValidationError('This value is not a valid URL.')
        }

        return value;
    }
}
