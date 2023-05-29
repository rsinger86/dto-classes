import { UrlField } from "./url-field";

describe('test', () => {
    test('should match', async () => {
        let testValue = 'https://github.com/encode/django-rest-framework/blob/master/rest_framework/fields.py'
        const schema = new UrlField({});
        const value = await schema.parse(testValue);
        expect(value).toEqual(testValue);
    });

    test('should not match', async () => {
        const schema = new UrlField({});
        await expect(
            async () => await schema.parse('hello')
        ).rejects.toThrow('This value is not a valid URL.');
    });
});
