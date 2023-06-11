import { BooleanField } from "./boolean-field";
import { CombineField } from "./combine-field";
import { NumberField } from "./number-field";
import { StringField } from "./string-field";


describe('anyOf parse tests', () => {
    test('should use number schema', async () => {
        const field = new CombineField({
            anyOf: [
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 1000 })
            ]
        });

        const value = await field.parseValue('999');
        expect(value).toEqual(999);
    });

    test('should use string schema', async () => {
        const field = new CombineField({
            anyOf: [
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 1000 })
            ]
        });

        const value = await field.parseValue('99');
        expect(value).toEqual('99');
    });

    test('should use boolean schema', async () => {
        const field = new CombineField({
            anyOf: [
                BooleanField.bind(),
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 1000 })
            ]
        });

        const value = await field.parseValue('1');
        expect(value).toEqual(true);
    });

    test('should fail if no matches', async () => {
        const t = async () => {
            await CombineField.parse('9999999999999', {
                anyOf: [
                    BooleanField.bind(),
                    StringField.bind({ maxLength: 2 }),
                    NumberField.bind({ maxValue: 1000 })
                ]
            },)
        }
        await expect(t).rejects.toThrow('None of the subschemas matched');
    });

    test('null should match first schema allowing null', async () => {
        const value = await CombineField.parse(null, {
            anyOf: [
                BooleanField.bind(),
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ allowNull: true })
            ]
        });

        expect(value).toEqual(null);
    });
});



describe('oneOf parse tests', () => {
    test('should use number schema', async () => {
        const field = new CombineField({
            oneOf: [
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 1000 })
            ]
        });

        const value = await field.parseValue('999');
        expect(value).toEqual(999);
    });

    test('should use string schema', async () => {
        const field = new CombineField({
            oneOf: [
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 80 })
            ]
        });

        const value = await field.parseValue('99');
        expect(value).toEqual('99');
    });

    test('should fail if no matches', async () => {
        const t = async () => {
            await CombineField.parse('9999999999999', {
                oneOf: [
                    BooleanField.bind(),
                    StringField.bind({ maxLength: 2 }),
                    NumberField.bind({ maxValue: 1000 })
                ]
            },)
        }
        await expect(t).rejects.toThrow('None of the subschemas matched');
    });

    test('null should match first schema allowing null', async () => {
        const value = await CombineField.parse(null, {
            oneOf: [
                BooleanField.bind(),
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ allowNull: true })
            ]
        });

        expect(value).toEqual(null);
    });

    test('should use string schema', async () => {
        const field = new CombineField({
            oneOf: [
                StringField.bind({ maxLength: 2 }),
                NumberField.bind({ maxValue: 80 })
            ]
        });

        const value = await field.parseValue('99');
        expect(value).toEqual('99');
    });

    test('should fail if more than one matches', async () => {
        const t = async () => {
            await CombineField.parse('1', {
                oneOf: [
                    BooleanField.bind(),
                    StringField.bind(),
                    NumberField.bind()
                ]
            },)
        }
        await expect(t).rejects.toThrow('Only one subschema is allowed to match, but 3 did');
    });
});



describe('constructor init tests', () => {
    test('should throw error if neither arg set', async () => {
        const t = async () => {
            await CombineField.parse('1', {},)
        }
        await expect(t).rejects.toThrow('When using CombineField, must set `anyOf` or `oneOf`, but not both');
    });

    test('should throw error if both args set', async () => {
        const t = async () => {
            await CombineField.parse('1', {
                oneOf: [
                    BooleanField.bind(),
                    StringField.bind()
                ],
                anyOf: [
                    BooleanField.bind(),
                    StringField.bind()
                ]
            },)
        }
        await expect(t).rejects.toThrow('When using CombineField, must set `anyOf` or `oneOf`, but not both');
    });

});
