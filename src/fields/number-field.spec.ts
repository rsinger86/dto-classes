import { ParseReturnType } from "src/types";
import { NumberField } from "./number-field";
import { BaseField, BaseFieldOptions } from "./base-field";

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


describe('test custom field', () => {
    test('test request user field', async () => {
        class User {
            id = 3;
        }
        const request = { user: new User() };

        class RequestUserField<T extends BaseFieldOptions> extends BaseField {
            _options: T;

            constructor(options?: T) {
                super(options);
            }

            public async parseValue(value: any): ParseReturnType<User, T> {
                return this._context.request.user;
            }

            public async getDefaultParseValue() {
                return this._context.request.user;
            }
        }

        const value = await RequestUserField.parse(3, { context: { request: request } });
        expect(value).toEqual(request.user)
    });


});
