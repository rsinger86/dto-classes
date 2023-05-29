import { NumberField } from "./number-field";

describe('test parse', () => {
    test('parse float string', async () => {
        const schema = new NumberField({});
        const value = await schema.parse('3.4444');
        expect(value).toEqual(3.4444);
    });

    test('parse float', async () => {
        const schema = new NumberField({});
        const value = await schema.parse(10.4444);
        expect(value).toEqual(10.4444);
    });


    test('parse fail on uncastable value', async () => {
        const schema = new NumberField({});
        await expect(
            async () => await schema.parse('lalala')
        ).rejects.toThrowError('Invalid number passed.')
    });

    test('fail when exceed max value', async () => {
        const schema = new NumberField({ maxValue: 10 });
        await expect(
            async () => await schema.parse('11')
        ).rejects.toThrowError('Ensure the value is no more than 10')
    });

    test('fail when under min value', async () => {
        const schema = new NumberField({ minValue: 10 });
        await expect(
            async () => await schema.parse('5')
        ).rejects.toThrowError('Ensure the value is at least 10.')
    });

});


describe('test format', () => {
    test('format string', async () => {
        const schema = new NumberField({});
        const value = await schema.format('3.4444');
        expect(value).toEqual(3.4444);
    });

    test('format NaN', async () => {
        const schema = new NumberField({});
        const value = await schema.format('adfadf3.4444');
        expect(value).toEqual(null);
    });
});
