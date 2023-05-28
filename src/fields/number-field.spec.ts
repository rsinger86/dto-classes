import { NumberField } from "./number-field";

describe('test', () => {
    test('parse float string', async () => {
        const schema = new NumberField({});
        const value = schema.parse('3.4444');
        expect(value).toEqual(3.4444);
    });

    test('parse float', async () => {
        const schema = new NumberField({});
        const value = schema.parse(10.4444);
        expect(value).toEqual(10.4444);
    });


    test('parse fail on uncastable value', async () => {
        const schema = new NumberField({});
        expect(() => schema.parse('lalala')).toThrowError('Invalid number passed.')
    });


    test('fail when exceed max value', async () => {
        const schema = new NumberField({ maxValue: 10 });
        expect(() => schema.parse('11')).toThrowError('Ensure the value is no more than 10')
    });

    test('fail when under min value', async () => {
        const schema = new NumberField({ minValue: 10 });
        expect(() => schema.parse('5')).toThrowError('Ensure the value is at least 10.')
    });


});
