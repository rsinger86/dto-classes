import { ArrayField } from "./array-field";
import { EmailField } from "./email-field";
import { StringField } from "./string-field";

describe('test', () => {
    test('should parse array of strings', async () => {
        const schema = new ArrayField({ item: new StringField() });
        var value = schema.parse(['A', 'B', 'C   ']);
        expect(value).toEqual(['A', 'B', 'C']);
    });

    test('should parse array of emails', async () => {
        const schema = new ArrayField({ item: new EmailField() });
        var value = schema.parse(['joe@hotmail.com', 'bill@gmail.com', 'louis@goldens.com']);
        expect(value).toEqual(['joe@hotmail.com', 'bill@gmail.com', 'louis@goldens.com']);
    });
});