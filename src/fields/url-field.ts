import { StringField } from "./string-field";
import { ValidationError } from "src/exceptions/validation-error";
import { REGEX_PATTERNS } from "src/regex";
import { AfterParse } from "../decorators";


export class UrlField extends StringField {

    @AfterParse()
    public validateUrlPattern(value: string) {
        if (!REGEX_PATTERNS.HTTP_URL.test(value)) {
            throw new ValidationError('This value is not a valid URL.')
        }

        return value;
    }
}
