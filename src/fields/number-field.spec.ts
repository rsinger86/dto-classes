import { NumberField } from "./number-field";

describe('test parse', () => {
    test('parse float string', async () => {
        const schema = new NumberField({});
        const value = await schema.parseValue('3.4444');
        expect(value).toEqual(3.4444);
    });

    test('parse float', async () => {
        const schema = new NumberField({});
        const value = await schema.parseValue(10.4444);
        expect(value).toEqual(10.4444);
    });


    test('parse fail on uncastable value', async () => {
        const schema = new NumberField({});
        await expect(
            async () => await schema.parseValue('lalala')
        ).rejects.toThrowError('Invalid number passed.')
    });

    test('fail when exceed max value', async () => {
        const schema = new NumberField({ maxValue: 10 });
        await expect(
            async () => await schema.parseValue('11')
        ).rejects.toThrowError('Ensure the value is no more than 10')
    });

    test('fail when under min value', async () => {
        const schema = new NumberField({ minValue: 10 });
        await expect(
            async () => await schema.parseValue('5')
        ).rejects.toThrowError('Ensure the value is at least 10.')
    });

});


describe('test format', () => {
    test('format string', async () => {
        const schema = new NumberField({});
        const value = await schema.formatValue('3.4444');
        expect(value).toEqual(3.4444);
    });

    test('format NaN', async () => {
        const schema = new NumberField({});
        const value = await schema.formatValue('adfadf3.4444');
        expect(value).toEqual(null);
    });
});
