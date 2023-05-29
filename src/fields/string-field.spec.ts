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