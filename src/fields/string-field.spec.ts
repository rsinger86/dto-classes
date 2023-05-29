import { StringField } from "./string-field";

describe('parse tests', () => {
    test('should allow blank', async () => {
        const schema = new StringField({ allowBlank: true });
        const value = await schema.parse('');
        expect(value).toEqual('');
    });

    test('should not allow blank', async () => {
        const schema = new StringField({ allowBlank: false });
        await expect(
            async () => await schema.parse('')
        ).rejects.toThrowError('This field may not be blank')
    });

    test('should trim', async () => {
        const schema = new StringField({ trimWhitespace: true });
        const value = await schema.parse(' The dog went for a walk.  ');
        expect(value).toEqual('The dog went for a walk.');
    });

    test('should not trim', async () => {
        const schema = new StringField({ trimWhitespace: false, allowNull: true });
        const value = await schema.parse(' The dog went for a walk.  ');
        expect(value).toEqual(' The dog went for a walk.  ');
    });

    test('should not allow null', async () => {
        const schema = new StringField({ allowNull: false });
        await expect(
            async () => await schema.parse(null)
        ).rejects.toThrowError('This field may not be null')
    });


    test('should allow null', async () => {
        const schema = new StringField({ allowNull: true });
        const value = await schema.parse(null);
        expect(value).toEqual(null);
    });

    test('should not allow more than X chars', async () => {
        const schema = new StringField({ maxLength: 10 });
        await expect(
            async () => await schema.parse('AAAAAAAAAAAAAAAAAAAAAAAAA')
        ).rejects.toThrowError('Ensure this field has no more than 10 characters')
    });

    test('should require at least X chars', async () => {
        const schema = new StringField({ minLength: 3 });
        await expect(
            async () => await schema.parse('A')
        ).rejects.toThrowError('Ensure this field has at least 3 characters')
    });
});

describe('validate pattern tests', () => {
    test('should match', async () => {
        const schema = new StringField({ pattern: /^Hi/ });
        const value = await schema.parse('Hi');
        expect(value).toEqual('Hi');
    });

    test('should not match', async () => {
        const schema = new StringField({ pattern: /^Hi/ });

        await expect(
            async () => await schema.parse('hello')
        ).rejects.toThrow('This value does not match the required pattern.');
    });
});


describe('validate email format tests', () => {
    test('should fail for invalid email', async () => {
        const schema = new StringField({ format: 'email' });
        await expect(
            async () => await schema.parse('tester.at.hotmail')
        ).rejects.toThrowError('Not a valid email address')
    });

    test('should pass for valid email', async () => {
        const schema = new StringField({ format: 'email' });
        const value = await schema.parse('tester@hotmail.com');
        expect(value).toEqual('tester@hotmail.com');
    });
});


describe('validate url format tests', () => {
    test('should match', async () => {
        let testValue = 'https://github.com/encode/django-rest-framework/blob/master/rest_framework/fields.py'
        const schema = new StringField({ format: 'url' });
        const value = await schema.parse(testValue);
        expect(value).toEqual(testValue);
    });

    test('should not match', async () => {
        const schema = new StringField({ format: 'url' });
        await expect(
            async () => await schema.parse('hello')
        ).rejects.toThrow('This value is not a valid URL.');
    });
});


describe('format tests', () => {
    test('should format as string', async () => {
        const schema = new StringField({ allowBlank: true });
        const value = await schema.format(1)
        expect(value).toEqual('1');
    });

    test('should format as string', async () => {
        const schema = new StringField({ allowBlank: true });
        const value = await schema.format({ 1: 2 })
        expect(value).toEqual('[object Object]');
    });

    test('should format as string', async () => {
        const schema = new StringField({ allowBlank: true });
        const value = await schema.format(false)
        expect(value).toEqual('false');
    });
});


