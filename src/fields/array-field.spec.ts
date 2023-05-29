import { ArrayField } from "./array-field";
import { EmailField } from "./email-field";
import { StringField } from "./string-field";


describe('test', () => {
    test('should parse array of strings', async () => {
        const schema = new ArrayField({ items: StringField.bind() });
        var value = await schema.parse(['A', 'B', 'C   ']);
        expect(value).toEqual(['A', 'B', 'C']);
    });

    test('should parse array of emails', async () => {
        const schema = new ArrayField({ items: EmailField.bind() });
        var value = await schema.parse(['joe@hotmail.com', 'bill@gmail.com', 'louis@goldens.com']);
        expect(value).toEqual(['joe@hotmail.com', 'bill@gmail.com', 'louis@goldens.com']);
    });

    test('should fail if exceed max items', async () => {
        const schema = new ArrayField({ items: new EmailField(), maxLength: 2 });

        await expect(async () => {
            await schema.parse(['joe@hotmail.com', 'bill@gmail.com', 'louis@goldens.com'])
        }).rejects.toThrow('nsure this field has no more than 2 items');
    });


    test('should fail if doesnt not meet min items', async () => {
        const schema = new ArrayField({ items: new EmailField(), minLength: 4 });

        await expect(async () => {
            await schema.parse(['joe@hotmail.com', 'bill@gmail.com', 'louis@goldens.com'])
        }).rejects.toThrow('Ensure this field has at least 4 items');
    });
});
